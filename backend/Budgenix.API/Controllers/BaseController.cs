using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Budgenix.API.Controllers
{

    [ApiController]
    [Authorize]
    public class BaseController : ControllerBase
    {
        protected string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User ID not found.");
        }
    }
}
