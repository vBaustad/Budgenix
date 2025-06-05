using Budgenix.Models.Users;

namespace Budgenix.Services
{
    public interface IUserService
    {
        string GetUserId();
        string? GetUserEmail();

        Task<ApplicationUser?> GetCurrentUserAsync();
    }
}
