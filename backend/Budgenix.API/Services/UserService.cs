using System.Security.Claims;

namespace Budgenix.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public UserService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public string GetUserId()
        {
            var user = _contextAccessor.HttpContext?.User;
            return user?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User ID not found.");
        }

        public string? GetUserEmail()
        {
            var user = _contextAccessor.HttpContext?.User;
            return user?.FindFirstValue(ClaimTypes.Email);
        }
    }
}
