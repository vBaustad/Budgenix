using Budgenix.API.Models.Users;
using Budgenix.Dtos.Shared;
using Budgenix.Dtos.Users;
using Budgenix.Helpers;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IStringLocalizer<SharedResource> _localizer;

        public AccountController(UserManager<ApplicationUser> userManager, JwtTokenService jwtTokenService, IStringLocalizer<SharedResource> localizer)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _localizer = localizer;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isFreeTier = dto.SubscriptionTier == SubscriptionTypeEnum.Free;

            DateTime? subscriptionStartDate = isFreeTier ? null : DateTime.UtcNow;
            DateTime? subscriptionEndDate = isFreeTier
                ? null
                : dto.BillingCycle == BillingCycleEnum.Monthly
                    ? DateTime.UtcNow.AddMonths(1)
                    : DateTime.UtcNow.AddYears(1);

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,

                // Address fields (optional)
                AddressLine1 = dto.AddressLine1,
                AddressLine2 = dto.AddressLine2,
                City = dto.City,
                StateOrProvince = dto.StateOrProvince,
                ZipOrPostalCode = dto.ZipOrPostalCode,
                Country = dto.Country,

                // Subscription details
                SubscriptionTier = dto.SubscriptionTier,
                SubscriptionIsActive = true,
                SubscriptionStartDate = subscriptionStartDate,
                SubscriptionEndDate = subscriptionEndDate,
                BillingCycle = dto.BillingCycle,

                //Referral
                ReferralCode = $"{dto.UserName}-{Guid.NewGuid().ToString().Substring(0, 6)}",


                // Payment IDs (optional)
                StripeCustomerId = dto.StripeCustomerId,
                PayPalSubscriptionId = dto.PayPalSubscriptionId
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // generate confirmation token
            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            // create confirmation link (you’d replace localhost in prod)
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account",
                new { userId = user.Id, emailToken }, Request.Scheme);

            // TODO: send confirmationLink via email
            Console.WriteLine($"{_localizer["Auth_EmailConfirmationLink"]} {confirmationLink}");



            return Ok(new
            {
                message = _localizer["Auth_RegistrationSuccessful"],
                confirmationLink // return it for testing; remove in prod
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            token = Uri.UnescapeDataString(token);


            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return BadRequest(_localizer["Auth_EmailConfirmationFailed"]);

            // activate subscription only after email confirmed
            user.SubscriptionIsActive = true;
            user.SubscriptionStartDate ??= DateTime.UtcNow;

            await _userManager.UpdateAsync(user);


            var jwtToken = _jwtTokenService.CreateToken(user);

            // Set token in HttpOnly cookie
            Response.Cookies.Append("authToken", jwtToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Set to true if using HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(_localizer["Auth_EmailConfirmed"]);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if(user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized(_localizer["Auth_InvalidEmailOrPw"]);
            }

            if (!user.EmailConfirmed)
            {
                return Unauthorized(_localizer["Auth_ConfirmEmailBeforeLogin"]);
            }

            var token = _jwtTokenService?.CreateToken(user);

            // Set token in HttpOnly cookie
            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                //Secure = true, // Set to true if using HTTPS
                Secure=false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = _localizer["Auth_LoginSuccessful"],
                user = new
                {
                    user.Id,
                    user.UserName,
                    user.Email
                }
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Remove the auth token cookie
            Response.Cookies.Delete("authToken");

            return Ok(new { message = _localizer["Auth_LogoutSuccessful"] });
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult GetProtected()
        {
            return Ok(new { message = _localizer["Auth_ProtectedRouteAccessed"] });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.SubscriptionTier,
                user.SubscriptionIsActive,
                user.SubscriptionStartDate,
                user.SubscriptionEndDate,
                user.BillingCycle,
                user.ReferralCode
            });
        }

        [Authorize]
        [HttpGet("me/currency")]
        public async Task<ActionResult<string>> GetCurrency()
        {
            var user = await _userManager.GetUserAsync(User);
            return Ok(new { currency = user.PreferredCurrency ?? "USD" });


        }

        [HttpPut("me/currency")]
        public async Task<IActionResult> UpdateCurrency([FromBody] UpdateCurrencyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.GetUserAsync(User);
            user.PreferredCurrency = dto.Currency;
            await _userManager.UpdateAsync(user);
            return NoContent();
        }

    }
}
