using Budgenix.Models.Users;

namespace Budgenix.Services.User
{
    public interface IUserService
    {
        string GetUserId();
        string? GetUserEmail();

        Task<ApplicationUser?> GetCurrentUserAsync();
    }
}
