using Budgenix.Dtos.Cashflow;
using Budgenix.Dtos.Insights;
using Budgenix.Services.Finance;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CashflowController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICashflowService _cashflowService;

        public CashflowController(IUserService userService, ICashflowService cashflowService)
        {
            _userService = userService;
            _cashflowService = cashflowService;
        }

        private string UserId => _userService.GetUserId();


        [HttpGet]
        public async Task<ActionResult<List<CashflowItemDto>>> GetItems()
        {
            var items = await _cashflowService.GetItemsAsync(UserId);
            return Ok(items);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<CashflowSummaryDto>> GetSummary()
        {
            var summary = await _cashflowService.GetSummaryAsync(UserId);
            return Ok(summary);
        }

        [HttpGet("insights")]
        public async Task<ActionResult<List<InsightDto>>> GetInsights()
        {
            var insights = await _cashflowService.GetInsightsAsync(UserId);
            return Ok(insights);
        }


        [HttpPost]
        public async Task<ActionResult<CashflowItemDto>> AddItem(CreateCashflowItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _cashflowService.AddItemAsync(UserId, dto);
            return CreatedAtAction(nameof(GetItems), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(Guid id, UpdateCashflowItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _cashflowService.UpdateItemAsync(UserId, id, dto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            var success = await _cashflowService.DeleteItemAsync(UserId, id);
            return success ? NoContent() : NotFound();
        }

    }
}
