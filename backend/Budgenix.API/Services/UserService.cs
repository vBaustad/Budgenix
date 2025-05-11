using Budgenix.Models.Shared;
using Microsoft.Extensions.Localization;
using System.Security.Claims;

namespace Budgenix.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IStringLocalizer<SharedResource> _localizer;

        public UserService(IHttpContextAccessor contextAccessor, IStringLocalizer<SharedResource> localizer)
        {
            _contextAccessor = contextAccessor;
            _localizer = localizer;
        }

        public string GetUserId()
        {
            var user = _contextAccessor.HttpContext?.User;
            return user?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException(_localizer["Shared_UserIdNotFound"]);
        }

        public string? GetUserEmail()
        {
            var user = _contextAccessor.HttpContext?.User;
            return user?.FindFirstValue(ClaimTypes.Email);
        }
    }
}
