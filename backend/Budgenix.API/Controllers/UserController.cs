using Budgenix.Dtos.Shared;
using Budgenix.Dtos.Users;
using Budgenix.Models.Shared;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public UserController(IUserService userService, IStringLocalizer<SharedResource> localizer)
    {
        _userService = userService;
        _localizer = localizer;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var user = await _userService.GetUserDetailsAsync();
        if (user == null) return Unauthorized();
        return Ok(user);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateUserDto dto)
    {
        await _userService.UpdateUserAsync(dto);
        return NoContent();
    }

    [HttpPut("me/password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            await _userService.ChangePasswordAsync(dto);
            return NoContent();
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("me/tier")]
    public async Task<IActionResult> GetMySubscriptionTier()
    {
        var tier = await _userService.GetEffectiveSubscriptionTierAsync();
        return Ok(new { tier });
    }


    [HttpGet("me/currency")]
    public async Task<IActionResult> GetCurrency()
    {
        var currency = await _userService.GetCurrencyAsync();
        return Ok(new { currency });
    }

    [HttpPut("me/currency")]
    public async Task<IActionResult> UpdateCurrency([FromBody] UpdateCurrencyDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        await _userService.UpdateCurrencyAsync(dto.Currency);
        return NoContent();
    }
}
