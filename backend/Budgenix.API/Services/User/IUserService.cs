using Budgenix.Dtos.Users;
using Budgenix.Models.Users;

namespace Budgenix.Services.User
{
    public interface IUserService
    {
        string GetUserId();
        string? GetUserEmail();
        Task<ApplicationUser?> GetCurrentUserAsync();
        Task<UserDto?> GetUserDetailsAsync();
        Task UpdateUserAsync(UpdateUserDto dto);
        Task<string> GetCurrencyAsync();
        Task UpdateCurrencyAsync(string currency);

        Task ChangePasswordAsync(UpdatePasswordDto dto);

    }
}
