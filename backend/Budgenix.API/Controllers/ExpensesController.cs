using Budgenix.Services;
using Microsoft.AspNetCore.Mvc;

public class ExpensesController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IExpensesService _service;

    public ExpensesController(IUserService userService, IExpensesService service)
    {
        _userService = userService;
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExpenseById(Guid id)
    {
        var userId = _userService.GetUserId();
        var result = await _service.GetExpenseByIdAsync(userId, id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    // Similar thin actions for GetExpenses, AddExpense, UpdateExpense, DeleteExpense etc.
}
