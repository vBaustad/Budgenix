using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Budgenix.Dtos.Incomes;
using Budgenix.Services.Finance;
using Budgenix.Services.User;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IncomesController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IIncomeService _incomeService;

        public IncomesController(IUserService userService, IIncomeService incomeService)
        {
            _userService = userService;
            _incomeService = incomeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetIncomes(/* add filters as needed */)
        {
            var userId = _userService.GetUserId();
            var result = await _incomeService.GetIncomesAsync(userId /*, filters */);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncomeById(Guid id)
        {
            var userId = _userService.GetUserId();
            var result = await _incomeService.GetIncomeByIdAsync(userId, id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("total")]
        public async Task<IActionResult> GetTotalIncome()
        {
            var userId = _userService.GetUserId();
            var total = await _incomeService.GetTotalAsync(userId);
            return Ok(total);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetUsedIncomeCategories()
        {
            var userId = _userService.GetUserId();
            var categories = await _incomeService.GetUsedCategoriesAsync(userId);
            return Ok(categories);
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetIncomeOverview([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();
            var result = await _incomeService.GetOverviewAsync(userId, month, year);
            return Ok(result);
        }

        [HttpGet("monthly-summary")]
        public async Task<IActionResult> GetMonthlyIncomeSummary([FromQuery] int months = 6)
        {
            var userId = _userService.GetUserId();
            var result = await _incomeService.GetMonthlySummaryAsync(userId, months);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddIncome([FromBody] CreateIncomeDto dto)
        {
            var userId = _userService.GetUserId();
            var created = await _incomeService.AddIncomeAsync(userId, dto);
            return CreatedAtAction(nameof(GetIncomeById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome(Guid id, [FromBody] UpdateIncomeDto dto)
        {
            var userId = _userService.GetUserId();
            var success = await _incomeService.UpdateIncomeAsync(userId, id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(Guid id)
        {
            var userId = _userService.GetUserId();
            var success = await _incomeService.DeleteIncomeAsync(userId, id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
