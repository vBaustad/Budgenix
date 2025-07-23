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

        [HttpPost("user/{id}/grant-subscription")]
        public async Task<IActionResult> GrantManualSubscription(string id, [FromBody] GrantSubscriptionOverrideDto dto)
        {
            if (id != dto.UserId)
                return BadRequest("User ID mismatch.");

            var result = await _adminService.GrantManualSubscriptionAsync(dto);
            return result ? Ok(new { message = "Subscription override granted." }) : BadRequest("Failed to grant override.");
        }

        [HttpGet("user/{id}/overrides")]
        public async Task<IActionResult> GetUserOverrides(string id)
        {
            var overrides = await _adminService.GetManualSubscriptionOverridesAsync(id);
            return Ok(overrides);
        }

        [HttpDelete("user/{userId}/override/{overrideId}")]
        public async Task<IActionResult> RevokeManualSubscription(string userId, Guid overrideId, [FromQuery] string? reason)
        {
            var success = await _adminService.RevokeManualSubscriptionAsync(overrideId, reason);
            return success ? Ok(new { message = "Override revoked" }) : BadRequest("Failed to revoke override");
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
