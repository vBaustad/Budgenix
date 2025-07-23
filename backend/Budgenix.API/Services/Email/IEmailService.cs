using Budgenix.Models.Users;

namespace Budgenix.Services.Email
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string toEmail, string confirmationLink);
        Task SendSubscriptionGrantedEmailAsync(string toEmail, string firstName, SubscriptionTypeEnum tier, DateTime endDate);
        Task SendSubscriptionRevokedEmailAsync(string toEmail, string firstName, SubscriptionTypeEnum tier, DateTime endDate, string? customMessage = null);
    }
}

