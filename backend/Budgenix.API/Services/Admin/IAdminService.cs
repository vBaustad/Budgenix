using Budgenix.Dtos.Admin;
using Budgenix.Models.Users;

namespace Budgenix.Services.Admin
{
    public interface IAdminService
    {
        Task<List<AdminUserDto>> GetAllUsersAsync();
        Task<bool> GrantManualSubscriptionAsync(GrantSubscriptionOverrideDto dto);
        Task<List<ManualSubscriptionOverrideDto>> GetManualSubscriptionOverridesAsync(string userId);
        Task<bool> RevokeManualSubscriptionAsync(Guid overrideId, string userId, string? reason = null);
        Task<AdminUserDetailsDto> GetUserDetailsAsync(string id);
        Task<AdminDeleteResultDto> DeleteUserAsync(string id);
        Task DeleteUserItemAsync(string id, string type, Guid itemId);
    }

}
