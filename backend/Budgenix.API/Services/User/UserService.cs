using Budgenix.Data;
using Budgenix.Dtos.Users;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using System.Security.Claims;

namespace Budgenix.Services.User
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly BudgenixDbContext _context;

        public UserService(IHttpContextAccessor contextAccessor, IStringLocalizer<SharedResource> localizer, UserManager<ApplicationUser> userManager, BudgenixDbContext context)
        {
            _contextAccessor = contextAccessor;
            _localizer = localizer;
            _userManager = userManager;
            _context = context;
        }

        // -------------------------
        // Context + Claims Access
        // -------------------------

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

        // -------------------------
        // User Info / Profile
        // -------------------------

        public async Task<UserDto?> GetUserDetailsAsync()
        {
            var user = await GetCurrentUserAsync();
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var isAdmin = roles.Contains("Admin");

            var now = DateTime.UtcNow;
            var activeOverride = await _context.ManualSubscriptionOverrides
                .Where(o => o.UserId == user.Id && o.StartDate <= now && o.EndDate > now)
                .OrderByDescending(o => o.EndDate)
                .FirstOrDefaultAsync();

            var effectiveTier = activeOverride?.Tier ?? user.SubscriptionTier;


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
                SubscriptionTier = effectiveTier,
                OverrideSubscriptionEndDate = activeOverride?.EndDate,
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

        // -------------------------
        // Password Management
        // -------------------------

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

        // -------------------------
        // Currency Preferences
        // -------------------------

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

        // -------------------------
        // Subscription Overrides
        // -------------------------

        public async Task<SubscriptionTypeEnum> GetEffectiveSubscriptionTierAsync()
        {
            var user = await GetCurrentUserAsync();
            if (user == null) throw new UnauthorizedAccessException();

            var now = DateTime.UtcNow;

            var activeOverride = await _context.ManualSubscriptionOverrides
                .Where(o => o.UserId == user.Id && o.StartDate <= now && o.EndDate > now)
                .OrderByDescending(o => o.EndDate)
                .FirstOrDefaultAsync();

            return activeOverride?.Tier ?? user.SubscriptionTier;
        }

        public async Task<SubscriptionTypeEnum> GetEffectiveSubscriptionTierAsync(string userId)
        {
            var now = DateTime.UtcNow;

            var activeOverride = await _context.ManualSubscriptionOverrides
                .Where(o => o.UserId == userId && o.StartDate <= now && o.EndDate > now)
                .OrderByDescending(o => o.EndDate)
                .FirstOrDefaultAsync();

            var user = await _userManager.FindByIdAsync(userId);
            return activeOverride?.Tier ?? user?.SubscriptionTier ?? SubscriptionTypeEnum.Free;
        }
    }
}
