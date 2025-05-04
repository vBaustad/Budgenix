using Budgenix.Dtos.Users;
using Budgenix.Helpers;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenService _jwtTokenService;

        public AccountController(UserManager<ApplicationUser> userManager, JwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        //[Authorize]
        [HttpGet("protected")]        
        public IActionResult GetProtected()
        {
            return Ok(new { message = "You have accessed a protected route!" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,

                // Address fields (optional)
                AddressLine1 = dto.AddressLine1,
                AddressLine2 = dto.AddressLine2,
                City = dto.City,
                StateOrProvince = dto.StateOrProvince,
                ZipOrPostalCode = dto.ZipOrPostalCode,
                Country = dto.Country,

                // Subscription details
                SubscriptionTier = dto.SubscriptionTier,
                SubscriptionIsActive = dto.SubscriptionIsActive,
                SubscriptionStartDate = dto.SubscriptionIsActive ? DateTime.UtcNow : null,
                SubscriptionEndDate = null, // you might calculate this based on BillingCycle if needed

                BillingCycle = dto.BillingCycle,

                // Payment IDs (optional)
                StripeCustomerId = dto.StripeCustomerId,
                PayPalSubscriptionId = dto.PayPalSubscriptionId
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var token = _jwtTokenService.CreateToken(user);

            // Set token in HttpOnly cookie
            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Set to true if using HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = "Registration successful",
                user = new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.SubscriptionTier,
                    user.SubscriptionIsActive,
                    user.BillingCycle
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if(user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            var token = _jwtTokenService?.CreateToken(user);

            // Set token in HttpOnly cookie
            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                //Secure = true, // Set to true if using HTTPS
                Secure=false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = "Login successful",
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

            return Ok(new { message = "Logged out successfully" });
        }
    }
}
