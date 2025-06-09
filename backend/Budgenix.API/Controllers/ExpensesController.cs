using Microsoft.AspNetCore.Mvc;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Budgenix.Services;
using AutoMapper;
using Budgenix.Helpers.Query;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Microsoft.Extensions.Localization;
using Budgenix.Models.Categories;
using Budgenix.Services.Recurring;
using Budgenix.Dtos.Recurring;

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
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly RecurringItemService _recurringService;

        public ExpensesController(IUserService userService, BudgenixDbContext context, IMapper mapper, IStringLocalizer<SharedResource> localizer, RecurringItemService recurringService)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
            _localizer = localizer;
            _recurringService = recurringService;
        }

        // =======================================
        // ==========      GET APIs      =========
        // =======================================

        // Get all expenses (optionally filter by date or category)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(
            DateTime? from = null,
            DateTime? to = null,
            string? categories = null,
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

            var categoryGuids = categories?
               .Split(',')
               .Select(c => Guid.TryParse(c.Trim(), out var id) ? id : (Guid?)null)
               .Where(g => g.HasValue)
               .Select(g => g.Value)
               .ToList() ?? new List<Guid>();

            expenses = ExpenseQueryHelper.ApplyFilters(expenses, from, to, categoryGuids);

            expenses = ExpenseQueryHelper.ApplySorting(expenses, sort);             

            //Apply grouping
            if (!string.IsNullOrWhiteSpace(groupBy))
            {
                var groupByKey = groupBy.ToLower();

                if (groupByKey != "month" && groupByKey != "category" && groupByKey != "year")
                    return BadRequest(_localizer["Shared_InvalidGroupByValue"]);

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
                return BadRequest(_localizer["Shared_EmptySearchQuery"]);

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

        [HttpGet("overview")]
        public async Task<IActionResult> GetExpenseOverview([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();

            if (month < 1 || month > 12 || year < 2000)
                return BadRequest("Invalid month or year");

            var firstOfMonth = new DateTime(year, month, 1);
            var lastMonth = firstOfMonth.AddMonths(-1);

            var totalExpense = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var lastMonthExpense = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == lastMonth.Month && e.Date.Year == lastMonth.Year)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var incomeReceived = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == month && i.Date.Year == year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var recurringItems = await _context.RecurringItems
                .Where(r => r.UserId == userId && r.Type == RecurringItemType.Expense && r.IsActive)
                .ToListAsync();

            var nextItemWithDate = recurringItems
                .Select(r => new
                {
                    Item = r,
                    NextDate = _recurringService.GetNextOccurrenceDate(r, DateTime.Today)
                })
                .Where(x => x.NextDate != null)
                .OrderBy(x => x.NextDate)
                .FirstOrDefault();

            var nextRecurring = nextItemWithDate == null
                ? null
                : new UpcomingRecurringDto
                {
                    NextDate = nextItemWithDate.NextDate.Value.ToString("o"),
                    Amount = nextItemWithDate.Item.Amount
                };

            var daysInMonth = DateTime.DaysInMonth(year, month);
            var dailyTotals = new decimal[daysInMonth];

            var dailyExpenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date.Month == month && e.Date.Year == year)
                .GroupBy(e => e.Date.Day)
                .Select(g => new { Day = g.Key, Total = g.Sum(e => e.Amount) })
                .ToListAsync();

            foreach (var entry in dailyExpenses)
            {
                dailyTotals[entry.Day - 1] = entry.Total;
            }

            return Ok(new
            {
                totalExpense,
                lastMonthExpense,
                incomeReceived,
                upcomingRecurring = nextRecurring,
                dailyTotals
            });
        }



        // =======================================
        // ==========     POST APIs      =========
        // =======================================

        // Create a new expense and return it with a new ID
        [HttpPost]
        public async Task<ActionResult> AddExpense([FromBody] CreateExpenseDto dto)        {

            var userId = _userService.GetUserId();
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            if (category == null)
                return BadRequest(_localizer["Shared_InvalidCategoryId"]);

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
            if (category == null) return BadRequest(_localizer["Shared_InvalidCategoryId"]);

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
