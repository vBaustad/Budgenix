using Budgenix.API.Models.Users;
using Budgenix.Dtos.Shared;
using Budgenix.Dtos.Users;
using Budgenix.Helpers;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Budgenix.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public AccountController(UserManager<ApplicationUser> userManager, JwtTokenService jwtTokenService, IEmailService emailService, IStringLocalizer<SharedResource> localizer, IConfiguration config)
        {
            _userManager = userManager;
            _emailService = emailService;
            _jwtTokenService = jwtTokenService;
            _localizer = localizer;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isFreeTier = dto.SubscriptionTier == SubscriptionTypeEnum.Free;

            DateTime? subscriptionStartDate = isFreeTier ? null : DateTime.UtcNow;
            DateTime? subscriptionEndDate = isFreeTier
                ? null
                : dto.BillingCycle == BillingCycleEnum.Monthly
                    ? DateTime.UtcNow.AddMonths(1)
                    : DateTime.UtcNow.AddYears(1);

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                AddressLine1 = dto.AddressLine1,
                AddressLine2 = dto.AddressLine2,
                City = dto.City,
                StateOrProvince = dto.StateOrProvince,
                ZipOrPostalCode = dto.ZipOrPostalCode,
                Country = dto.Country,
                SubscriptionTier = dto.SubscriptionTier,
                SubscriptionIsActive = false,
                BillingCycle = dto.BillingCycle,
                ReferralCode = $"{dto.UserName}-{Guid.NewGuid().ToString().Substring(0, 6)}",
            };


            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account",
                new { userId = user.Id, token }, Request.Scheme);

            await _emailService.SendEmailConfirmationAsync(user.Email, confirmationLink);

            return Ok(new
            {
                message = _localizer["Auth_RegistrationSuccessful"]
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            token = Uri.UnescapeDataString(token);

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return BadRequest(_localizer["Auth_EmailConfirmationFailed"]);

            // activate subscription
            user.SubscriptionIsActive = true;
            user.SubscriptionStartDate ??= DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var jwtToken = _jwtTokenService.CreateToken(user);

            // Set token in HttpOnly cookie
            Response.Cookies.Append("authToken", jwtToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            var baseUrl = _config["Frontend:BaseUrl"];
            return Redirect($"{baseUrl}/dashboard");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            ApplicationUser user = null;

            // Try username first
            user = await _userManager.FindByNameAsync(dto.Login);

            // If not found, try email (basic check to reduce unnecessary email search)
            if (user == null && dto.Login.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(dto.Login);
            }

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized(_localizer["Auth_InvalidEmailOrPw"]);
            }

            if (!user.EmailConfirmed)
            {
                return Unauthorized(_localizer["Auth_ConfirmEmailBeforeLogin"]);
            }

            var token = _jwtTokenService?.CreateToken(user);

            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,  // Change to true for HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = _localizer["Auth_LoginSuccessful"],
                user = new
                {
                    user.Id,
                    user.UserName,
                    user.Email
                }
            });
        }


        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Remove the auth token cookie
            Response.Cookies.Delete("authToken");

            return Ok(new { message = _localizer["Auth_LogoutSuccessful"] });
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult GetProtected()
        {
            return Ok(new { message = _localizer["Auth_ProtectedRouteAccessed"] });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email,
                user.AddressLine1,
                user.AddressLine2,
                user.City,
                user.StateOrProvince,
                user.ZipOrPostalCode,
                user.Country,
                user.SubscriptionTier,
                user.SubscriptionIsActive,
                user.SubscriptionStartDate,
                user.SubscriptionEndDate,
                user.BillingCycle,
                user.ReferralCode,
                currency = user.PreferredCurrency ?? "USD"
            });
        }

        [Authorize]
        [HttpGet("me/currency")]
        public async Task<ActionResult<string>> GetCurrency()
        {
            var user = await _userManager.GetUserAsync(User);
            return Ok(new { currency = user.PreferredCurrency ?? "USD" });


        }

        [HttpPut("me/currency")]
        public async Task<IActionResult> UpdateCurrency([FromBody] UpdateCurrencyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.GetUserAsync(User);
            user.PreferredCurrency = dto.Currency;
            await _userManager.UpdateAsync(user);
            return NoContent();
        }

    }
}
