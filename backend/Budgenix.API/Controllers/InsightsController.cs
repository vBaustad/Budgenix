using Microsoft.AspNetCore.Mvc;
using Budgenix.Services.Insights;
using Microsoft.AspNetCore.Authorization;
using Budgenix.Services;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class InsightsController : ControllerBase
    {
        private readonly IInsightService _insightService;
        private readonly IUserService _userService;

        public InsightsController(IInsightService insightService, IUserService userService)
        {
            _insightService = insightService;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetInsights([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();

            if (month < 1 || month > 12 || year < 2000)
                return BadRequest("Invalid month or year");

            var insights = await _insightService.GenerateInsightsAsync(userId, month, year);
            return Ok(insights);
        }
    }
}
