using Microsoft.Extensions.Configuration;
using Stripe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Budgenix.API.Services
{
    public class StripeService
    {
        private readonly CustomerService _customerService;
        private readonly SubscriptionService _subscriptionService;

        public StripeService(IConfiguration config)
        {
            // Set your Stripe secret key
            StripeConfiguration.ApiKey = config["Stripe:SecretKey"];

            _customerService = new CustomerService();
            _subscriptionService = new SubscriptionService();
        }

        public async Task<Customer> CreateCustomerAsync(string email, string name, AddressOptions address)
        {
            var customerOptions = new CustomerCreateOptions
            {
                Email = email,
                Name = name,
                Address = address
            };

            var customer = await _customerService.CreateAsync(customerOptions);
            return customer;
        }

        public async Task<Subscription> CreateSubscriptionAsync(string customerId, string priceId)
        {
            var subscriptionOptions = new SubscriptionCreateOptions
            {
                Customer = customerId,
                Items = new List<SubscriptionItemOptions>
                {
                    new SubscriptionItemOptions
                    {
                        Price = priceId
                    }
                },
                PaymentBehavior = "default_incomplete",
                Expand = new List<string> { "latest_invoice.payment_intent" }
            };

            var subscription = await _subscriptionService.CreateAsync(subscriptionOptions);
            return subscription;
        }
    }
}
