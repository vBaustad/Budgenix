using Budgenix.API.Models.Users;
using Budgenix.Models.Users;

namespace Budgenix.Helpers
{
    public static class StripePriceHelper
    {
        public static string GetPriceId(SubscriptionTypeEnum tier, BillingCycleEnum billing)
        {
            return (tier, billing) switch
            {
                (SubscriptionTypeEnum.Hobby, BillingCycleEnum.Monthly) => "price_1RZsBSIkjDJhyKR2pi0xLjpL",
                (SubscriptionTypeEnum.Hobby, BillingCycleEnum.Annually) => "price_1RZsBnIkjDJhyKR26j79crDK",
                (SubscriptionTypeEnum.Pro, BillingCycleEnum.Monthly) => "price_1RZsC5IkjDJhyKR2lgxlIOxy",
                (SubscriptionTypeEnum.Pro, BillingCycleEnum.Annually) => "price_1RZsCOIkjDJhyKR2jAeS9b7F",
                _ => throw new Exception("Invalid plan selected")
            };
        }
    }
}
