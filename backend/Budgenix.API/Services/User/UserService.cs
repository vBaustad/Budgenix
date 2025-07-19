using Budgenix.Dtos.Users;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using System.Security.Claims;

namespace Budgenix.Services.User
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

        public async Task<UserDto?> GetUserDetailsAsync()
        {
            var user = await GetCurrentUserAsync();
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var isAdmin = roles.Contains("Admin");

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                AddressLine1 = user.AddressLine1,
                AddressLine2 = user.AddressLine2,
                City = user.City,
                StateOrProvince = user.StateOrProvince,
                ZipOrPostalCode = user.ZipOrPostalCode,
                Country = user.Country,
                SubscriptionTier = user.SubscriptionTier,
                SubscriptionIsActive = user.SubscriptionIsActive,
                SubscriptionStartDate = user.SubscriptionStartDate,
                SubscriptionEndDate = user.SubscriptionEndDate,
                BillingCycle = user.BillingCycle,
                ReferralCode = user.ReferralCode,
                Currency = user.Currency ?? "USD",
                IsAdmin = isAdmin
            };
        }

        public async Task UpdateUserAsync(UpdateUserDto dto)
        {
            var user = await GetCurrentUserAsync();
            if (user == null) throw new UnauthorizedAccessException();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.AddressLine1 = dto.AddressLine1;
            user.AddressLine2 = dto.AddressLine2;
            user.City = dto.City;
            user.StateOrProvince = dto.StateOrProvince;
            user.ZipOrPostalCode = dto.ZipOrPostalCode;
            user.Country = dto.Country;

            await _userManager.UpdateAsync(user);
        }

        public async Task ChangePasswordAsync(UpdatePasswordDto dto)
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
                throw new UnauthorizedAccessException(_localizer["Shared_UserNotFound"]);

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new ApplicationException(_localizer["Settings_PasswordChangeFailed"] + ": " + errors);
            }
        }


        public async Task<string> GetCurrencyAsync()
        {
            var user = await GetCurrentUserAsync();
            return user?.Currency ?? "USD";
        }

        public async Task UpdateCurrencyAsync(string currency)
        {
            var user = await GetCurrentUserAsync();
            if (user == null) throw new UnauthorizedAccessException();

            user.Currency = currency;
            await _userManager.UpdateAsync(user);
        }
    }
}
