using Budgenix.Dtos.Expenses;
using Budgenix.Services.Finance;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IExpenseService _expenseService;

        public ExpensesController(IUserService userService, IExpenseService expenseService)
        {
            _userService = userService;
            _expenseService = expenseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] List<Guid>? categoryIds,
            [FromQuery] string? sort)
        {
            var userId = _userService.GetUserId();
            var result = await _expenseService.GetExpensesAsync(userId, from, to, categoryIds, sort);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpenseById(Guid id)
        {
            var userId = _userService.GetUserId();
            var result = await _expenseService.GetExpenseByIdAsync(userId, id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("total")]
        public async Task<IActionResult> GetTotalExpense()
        {
            var userId = _userService.GetUserId();
            var total = await _expenseService.GetTotalAsync(userId);
            return Ok(total);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetUsedExpenseCategories()
        {
            var userId = _userService.GetUserId();
            var categories = await _expenseService.GetUsedCategoriesAsync(userId);
            return Ok(categories);
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetExpenseOverview([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();
            var result = await _expenseService.GetOverviewAsync(userId, month, year);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] CreateExpenseDto dto)
        {
            var userId = _userService.GetUserId();
            var created = await _expenseService.AddExpenseAsync(userId, dto);
            return CreatedAtAction(nameof(GetExpenseById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(Guid id, [FromBody] UpdateExpenseDto dto)
        {
            var userId = _userService.GetUserId();
            var success = await _expenseService.UpdateExpenseAsync(userId, id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id)
        {
            var userId = _userService.GetUserId();
            var success = await _expenseService.DeleteExpenseAsync(userId, id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
