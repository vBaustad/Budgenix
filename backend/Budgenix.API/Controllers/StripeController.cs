using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using System.IO;
using System.Threading.Tasks;
using Budgenix.API.Services;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Budgenix.Models.Shared;
using Budgenix.Dtos.Stripe;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;

//FOR DEV: stripe listen --forward-to localhost:5035/api/stripe/webhook

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StripeController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly StripeService _stripeService;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly IConfiguration _config;

        public StripeController(
            BudgenixDbContext context,
            StripeService stripeService,
            IMapper mapper,
            IStringLocalizer<SharedResource> localizer,
            IConfiguration config)
        {
            _context = context;
            _stripeService = stripeService;
            _mapper = mapper;
            _localizer = localizer;
            _config = config;
        }

        // ========== POST: Create Checkout Session ==========
        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateCheckoutSessionDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.PriceId))
            {
                return BadRequest(_localizer["Invalid request data"]);
            }

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                Mode = "subscription",
                LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            Price = dto.PriceId,
                            Quantity = 1
                        }
                    },
                CustomerEmail = dto.Email,
                SuccessUrl = "https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "https://yourapp.com/cancel"
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            return Ok(new { sessionId = session.Id, url = session.Url });

        }

        // ========== POST: Webhook endpoint ==========
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var signatureHeader = Request.Headers["Stripe-Signature"];
            var webhookSecret = _config["Stripe:WebhookSecret"];

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, signatureHeader, webhookSecret);
            }
            catch
            {
                return BadRequest();
            }

            switch (stripeEvent.Type)
            {
                case "checkout.session.completed":
                    await HandleCheckoutSessionCompleted(stripeEvent);
                    break;

                case "invoice.paid":
                case "invoice.payment_succeeded":
                    await HandleInvoicePaid(stripeEvent);
                    break;

                case "invoice.payment_failed":
                    // Optionally handle failed payments
                    break;

                case "customer.subscription.deleted":
                    await HandleSubscriptionDeleted(stripeEvent);
                    break;

                default:
                    // Optionally log unhandled events
                    break;
            }



            return Ok();
        }

        [HttpGet("checkout-session/{sessionId}")]
        public async Task<IActionResult> GetCheckoutSession(string sessionId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return BadRequest("Session ID is required.");
            }

            var service = new SessionService();
            try
            {
                var session = await service.GetAsync(sessionId);

                return Ok(new
                {
                    session.Id,
                    session.PaymentStatus,
                    session.CustomerEmail,
                    session.AmountTotal,
                    session.Currency
                });
            }
            catch (StripeException ex)
            {
                Console.WriteLine($"Stripe error: {ex.Message}");
                return StatusCode(500, "Error retrieving Checkout Session from Stripe.");
            }
        }

        private async Task HandleInvoicePaid(Event stripeEvent)
        {
            var fullJson = JsonConvert.SerializeObject(stripeEvent, Formatting.Indented);

            var invoice = stripeEvent.Data.Object as Invoice;
            if (invoice?.CustomerId == null)
            {
                Console.WriteLine("No customer ID in invoice.");
                return;
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.StripeCustomerId == invoice.CustomerId);
            if (user == null)
            {
                Console.WriteLine($"No user found for Stripe customer ID: {invoice.CustomerId}");
                return;
            }

            Console.WriteLine($"Recurring payment received for {user.Email}. Amount: {invoice.AmountPaid / 100.0} {invoice.Currency?.ToUpper()}");

            user.SubscriptionLastPaymentDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        private async Task HandleInvoicePaymentFailed(Event stripeEvent)
        {
            var invoice = stripeEvent.Data.Object as Invoice;
            if (invoice?.CustomerId == null)
            {
                Console.WriteLine("No customer ID in failed invoice.");
                return;
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.StripeCustomerId == invoice.CustomerId);
            if (user == null)
            {
                Console.WriteLine($"No user found for StripeCustomerId: {invoice.CustomerId}");
                return;
            }

            if (user.SubscriptionGracePeriodEnd == null)
            {
                user.SubscriptionGracePeriodEnd = DateTime.UtcNow.AddDays(7);  // 7 day grace period
                Console.WriteLine($"Grace period started for {user.Email}");
            }
            else
            {
                Console.WriteLine($"Grace period already active for {user.Email}, ends at {user.SubscriptionGracePeriodEnd}");
            }

            await _context.SaveChangesAsync();
        }


        private async Task HandleCheckoutSessionCompleted(Event stripeEvent)
        {
            var fullJson = JsonConvert.SerializeObject(stripeEvent, Formatting.Indented);

            var session = stripeEvent.Data.Object as Session;
            if (session == null)
            {
                Console.WriteLine("Stripe event does not contain a valid Session object.");
                return;
            }

            var customerId = session.Customer?.Id;
            var subscriptionId = session.Subscription?.Id;

            var email = session.CustomerEmail ?? session.CustomerDetails?.Email;
            if (string.IsNullOrWhiteSpace(email))
            {
                Console.WriteLine("No email found in checkout session.");
                return;
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                Console.WriteLine($"No user found with email: {email}");
                return;
            }

            user.StripeCustomerId = customerId;
            user.SubscriptionIsActive = true;
            user.SubscriptionStartDate = DateTime.UtcNow;

            // Optional: save subscription ID if you have a field for it
            // user.StripeSubscriptionId = subscriptionId;

            await _context.SaveChangesAsync();

            Console.WriteLine($"User {email} marked as active subscription.");
        }



        private async Task HandleSubscriptionDeleted(Event stripeEvent)
        {
            var sub = stripeEvent.Data.Object as Subscription;
            if (sub?.CustomerId == null) return;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.StripeCustomerId == sub.CustomerId);
            if (user != null)
            {
                user.SubscriptionIsActive = false;
                user.SubscriptionEndDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}
