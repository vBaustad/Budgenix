using Microsoft.AspNetCore.Mvc;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Budgenix.Services;
using AutoMapper;
using Budgenix.Helpers.Query;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;

namespace Budgenix.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public ExpensesController(IUserService userService, BudgenixDbContext context, IMapper mapper)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
        }

        // =======================================
        // ==========      GET APIs      =========
        // =======================================

        // Get all expenses (optionally filter by date or category)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(
            DateTime? from = null,
            DateTime? to = null,
            string? category = null,
            string sort = "date_desc",
            string? groupBy = null,
            int skip = 0,
            int take = 100)
        {

            var userId = _userService.GetUserId();

            var expenses = _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.UserId == userId)
                .AsQueryable();
            //Apply filters and sorting
            expenses = ExpenseQueryHelper.ApplyFilters(expenses, from, to, category);
            expenses = ExpenseQueryHelper.ApplySorting(expenses, sort);

            //Apply grouping
            if (!string.IsNullOrWhiteSpace(groupBy))
            {
                var groupByKey = groupBy.ToLower();

                if (groupByKey != "month" && groupByKey != "category" && groupByKey != "year")
                    return BadRequest("Invalid groupBy value. Use 'month', 'category', or 'year'.");

                var groupedEntities = await expenses.ToListAsync();
                var grouped = ExpenseQueryHelper.ApplyGrouping(groupedEntities, groupByKey, _mapper);
                return Ok(grouped.ToList());
            }

            // Pagination
            var results = await expenses.Skip(skip).Take(take).ToListAsync();

            var expenseDto = _mapper.Map<List<ExpenseDto>>(results);

            return Ok(expenseDto);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Expense>>> SearchExpenses(string query)
        {
            var userId = _userService.GetUserId();

            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query cannot be empty.");

            var matches = await _context.Expenses
                .Include(i => i.Category)
                .Where(i => i.UserId == userId &&
                       (!string.IsNullOrEmpty(i.Name) && i.Name.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                       (!string.IsNullOrEmpty(i.Description) && i.Description.Contains(query, StringComparison.OrdinalIgnoreCase)))
                .ToListAsync();

            var expenseDto = _mapper.Map<List<ExpenseDto>>(matches);

            return Ok(expenseDto);
        }

        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetTotalAmount()
        {
            var userId = _userService.GetUserId();

            var total = await _context.Expenses
                .Where(i => i.UserId == userId)
                .SumAsync(i => i.Amount);

            return Ok(total);
        }

        [HttpGet("recurring-upcoming")]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetUpcomingRecurringExpenses(int daysAhead = 30)
        {
            var userId = _userService.GetUserId();

            var upcoming = await _context.Expenses
                .Include(i => i.Category)
                .Where(i => i.UserId == userId && i.IsRecurring && i.Date >= DateTime.Today && i.Date <= DateTime.Today.AddDays(daysAhead))
                .ToListAsync();

            var expenseDto = _mapper.Map<List<ExpenseDto>>(upcoming);

            return Ok(expenseDto);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsedExpenseCategories()
        {
            var userId = _userService.GetUserId();

            var categories = await _context.Expenses
                .Where(i => i.UserId == userId && i.Category != null)
                .Select(i => i.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToListAsync();

            return Ok(categories);
        }

        // Get a single expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpenseById(Guid id)
        {
            var userId = _userService.GetUserId();

            var expense = await _context.Expenses
                .Include(i => i.Category)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null) return NotFound();

            var dto = _mapper.Map<ExpenseDto>(expense);

            return Ok(dto);
        }

        // =======================================
        // ==========     POST APIs      =========
        // =======================================

        // Create a new expense and return it with a new ID
        [HttpPost]
        public async Task<ActionResult> AddExpense(CreateExpenseDto dto)
        {
            var userId = _userService.GetUserId();
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            if (category == null)
                return BadRequest("Invalid category ID.");

            var expense = _mapper.Map<Expense>(dto);
            expense.Id = Guid.NewGuid(); // Set ID manually
            expense.Category = category; // Set Category
            expense.UserId = userId;     // Set ownership

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            var expenseDto = _mapper.Map<ExpenseDto>(expense);

            return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, expenseDto);
        }

        // =======================================
        // ==========     PUT APIs       =========
        // =======================================

        // Update an existing expense by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(Guid id, UpdateExpenseDto dto) 
        {
            var userId = _userService.GetUserId();

            var existing = await _context.Expenses.Include(i => i.Category)
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (existing == null) return NotFound();

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null) return BadRequest("Invalid category ID.");

            _mapper.Map(dto, existing);
            existing.Category = category;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // =======================================
        // ==========    DELETE APIs     =========
        // =======================================

        // Delete an expense by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id) 
        {
            var userId = _userService.GetUserId();

            var expense = await _context.Expenses
                            .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

            if (expense == null) return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
