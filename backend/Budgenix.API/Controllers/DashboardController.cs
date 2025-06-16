using Budgenix.Dtos.Dashboard;
using Budgenix.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IDashboardService _dashboardService;

    public DashboardController(IUserService userService, IDashboardService dashboardService)
    {
        _userService = userService;
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary([FromQuery] int month, [FromQuery] int year)
    {
        var userId = _userService.GetUserId();
        var summary = await _dashboardService.GetDashboardSummaryAsync(userId, month, year);
        return Ok(summary);
    }
}
