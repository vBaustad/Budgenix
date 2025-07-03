using Budgenix.Dtos.Admin;

namespace Budgenix.Services.Admin
{
    public interface IAdminService
    {
        Task<List<AdminUserDto>> GetAllUsersAsync();
        Task<AdminUserDetailsDto> GetUserDetailsAsync(string id);
        Task<AdminDeleteResultDto> DeleteUserAsync(string id);
        Task DeleteUserItemAsync(string id, string type, Guid itemId);
    }

}
