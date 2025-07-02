using Budgenix.Dtos.Admin;
using Budgenix.Services.Admin;
using Budgenix.Services.Audit; // ✅ Needed for IAuditService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IAuditService _auditService;

        public AdminController(IAdminService adminService, IAuditService auditService)
        {
            _adminService = adminService;
            _auditService = auditService;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetAllUsers()
        {
            return Ok(await _adminService.GetAllUsersAsync());
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<AdminUserDetailsDto>> GetUserDetails(string id)
        {
            return Ok(await _adminService.GetUserDetailsAsync(id));
        }

        [HttpDelete("user/{id}")]
        public async Task<ActionResult<AdminDeleteResultDto>> DeleteUser(string id)
        {
            return Ok(await _adminService.DeleteUserAsync(id));
        }

        [HttpDelete("user/{id}/{type}/{itemId}")]
        public async Task<IActionResult> DeleteUserItem(string id, string type, Guid itemId)
        {
            await _adminService.DeleteUserItemAsync(id, type, itemId);
            return NoContent();
        }

        [HttpGet("user/{id}/logs")]
        public async Task<ActionResult<List<AdminAuditLogDto>>> GetUserAuditLogs(string id)
        {
            var logs = await _auditService.GetLogsForUserAsync(id);
            return Ok(logs);
        }
    }
}
