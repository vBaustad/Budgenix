namespace Budgenix.Dtos.Stripe
{
    public class CreateCheckoutSessionDto
    {
        public string PriceId { get; set; }
        public string Email { get; set; }
    }
}
