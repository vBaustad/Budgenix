using Budgenix.Models.System;
using Budgenix.Services.System;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{   
    [ApiController]
    [Route("api/[controller]")]
    public class SystemNotificationsController : ControllerBase
    {
        private readonly ISystemNotificationsService _service;
        private readonly IUserService _userService;

        public SystemNotificationsController(
            ISystemNotificationsService service,
            IUserService userService)
        {
            _service = service;
            _userService = userService;
        }

        [HttpGet("unread")]
        public async Task<ActionResult<List<SystemNotification>>> GetUnread()
        {
            var userId = _userService.GetUserId();
            var notifications = await _service.GetUnreadForUserAsync(userId);
            return Ok(notifications);
        }

        [HttpPost("mark-read/{id}")]
        public async Task<IActionResult> MarkAsRead(string id)
        {
            var userId = _userService.GetUserId();
            await _service.MarkAsReadAsync(userId, id);
            return NoContent();
        }
    }    
}
