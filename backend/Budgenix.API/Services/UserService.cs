using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using System.Security.Claims;

namespace Budgenix.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(IHttpContextAccessor contextAccessor, IStringLocalizer<SharedResource> localizer, UserManager<ApplicationUser> userManager)
        {
            _contextAccessor = contextAccessor;
            _localizer = localizer;
            _userManager = userManager;
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

        public async Task<ApplicationUser?> GetCurrentUserAsync()
        {
            return await _userManager.GetUserAsync(_contextAccessor.HttpContext?.User);

        }
    }
}
