using Microsoft.AspNetCore.Mvc;
using Budgenix.Models.Shared;
using Budgenix.Helpers.Query;
using Budgenix.Models;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using Budgenix.Dtos.Incomes;
using Budgenix.Services;
using AutoMapper;
using Budgenix.Models.Finance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using Budgenix.Dtos.Recurring;
using System.Text.Json;
using Budgenix.Services.Recurring;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IncomesController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly RecurringItemService _recurringService;

        public IncomesController(IUserService userService, BudgenixDbContext context, IMapper mapper, IStringLocalizer<SharedResource> localizer, RecurringItemService recurringService)
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetIncomes(
            DateTime? from = null,
            DateTime? to = null,
            string? category = null,
            string sort = "date_desc",
            string? groupBy = null,
            int skip = 0,
            int take = 100)
        {

            var userId = _userService.GetUserId();

            var incomes = _context.Incomes
                .Include(i => i.Category)
                .Where(i => i.UserId == userId)
                .AsQueryable();

            //Apply filters and sorting
            incomes = IncomeQueryHelper.ApplyFilters(incomes, from, to, category);
            incomes = IncomeQueryHelper.ApplySorting(incomes, sort);

            //Apply grouping
            if (!string.IsNullOrWhiteSpace(groupBy))
            {
                var groupByKey = groupBy.ToLower();

                if (groupByKey != "month" && groupByKey != "category" && groupByKey != "year")
                    return BadRequest(_localizer["Shared_InvalidGroupByValue"]);

                var groupedEntities = await incomes.ToListAsync();
                var grouped = IncomeQueryHelper.ApplyGrouping(groupedEntities, groupByKey, _mapper);
                return Ok(grouped.ToList());
            }

            // Pagination
            var results = await incomes.Skip(skip).Take(take).ToListAsync();

            // Map to DTO
            var incomeDto = _mapper.Map<List<IncomeDto>>(results);

            return Ok(incomeDto);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<IncomeDto>>> SearchIncomes(string query)
        {
            var userId = _userService.GetUserId();

            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(_localizer["Shared_EmptySearchQuery"]);

            var matches = await _context.Incomes
                .Include(i => i.Category)
                .Where(i => i.UserId == userId &&
                    (i.Name.Contains(query) || (i.Description != null && i.Description.Contains(query))))
                .ToListAsync();

            var incomeDto = _mapper.Map<List<IncomeDto>>(matches);

            return Ok(incomeDto);
        }

        // Get a single income by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncomeById(Guid id)
        {
            var userId = _userService.GetUserId();

            var result = await _context.Incomes
                .Include(i => i.Category)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (result == null) return NotFound();

            var incomeDto = _mapper.Map<IncomeDto>(result);

            return Ok(incomeDto);
        }

        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetTotalIncome()
        {
            var userId = _userService.GetUserId();

            var total = await _context.Incomes
                .Where(i => i.UserId == userId)
                .SumAsync(i => i.Amount);

            return Ok(total);
        }


        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsedIncomeCategories()
        {
            var userId = _userService.GetUserId();

            var categories = await _context.Incomes
                .Where(i => i.UserId == userId && i.Category != null)
                .Select(i => i.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetIncomeOverview([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();

            if (month < 1 || month > 12 || year < 2000)
                return BadRequest("Invalid month or year");

            var firstOfMonth = new DateTime(year, month, 1);
            var lastMonth = firstOfMonth.AddMonths(-1);

            var totalIncome = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == month && i.Date.Year == year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var lastMonthIncome = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == lastMonth.Month && i.Date.Year == lastMonth.Year)
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var recurringItems = await _context.RecurringItems
                .Where(r => r.UserId == userId && r.Type == RecurringItemType.Income && r.IsActive)
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

            var dailyIncomes = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date.Month == month && i.Date.Year == year)
                .GroupBy(i => i.Date.Day)
                .Select(g => new { Day = g.Key, Total = g.Sum(i => i.Amount) })
                .ToListAsync();

            foreach (var entry in dailyIncomes)
            {
                dailyTotals[entry.Day - 1] = entry.Total;
            }

            var responsePayload = new
            {
                totalIncome,
                lastMonthIncome,
                upcomingRecurring = nextRecurring,
                dailyTotals
            };

            
            return Ok(new
            {
                totalIncome,
                lastMonthIncome,
                upcomingRecurring = nextRecurring,
                dailyTotals
            });

        }

        [HttpGet("monthly-summary")]
        public async Task<ActionResult> GetMonthlyIncomeSummary([FromQuery] int months = 6)
        {
            var userId = _userService.GetUserId();

            if (months <= 0 || months > 24)
                return BadRequest("Invalid range");

            var start = DateTime.UtcNow.Date.AddMonths(-months + 1);

            var incomes = await _context.Incomes
                .Include(i => i.Category)
                .Where(i => i.UserId == userId && i.Date >= start && i.Category != null)
                .ToListAsync(); // 👈 Fetch first, then group in memory

            var summary = incomes
                .GroupBy(i => new
                {
                    i.Date.Year,
                    i.Date.Month,
                    Category = i.Category!.Name
                })
                .Select(g => new
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1),
                    Category = g.Key.Category,
                    Total = g.Sum(i => i.Amount)
                })
                .OrderBy(g => g.Month)
                .ToList();

            return Ok(summary);
        }




        // =======================================
        // ==========     POST APIs      =========
        // =======================================

        // Create a new income and return it with a new ID
        [HttpPost]
        public async Task<ActionResult> AddIncome(CreateIncomeDto dto)
        {
            var userId = _userService.GetUserId();
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            if (category == null)
                return BadRequest(_localizer["Shared_InvalidCategoryId"]);

           
            var income = _mapper.Map<Income>(dto);
            income.Id = Guid.NewGuid(); // Set ID manually
            income.Category = category; // Set Category
            income.UserId = userId;     // Set ownership

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            var incomeDto = _mapper.Map<IncomeDto>(income);

            return CreatedAtAction(nameof(GetIncomeById), new { id = income.Id }, incomeDto);
        }

        // =======================================
        // ==========     PUT APIs       =========
        // =======================================

        // Update an existing income by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome(Guid id, UpdateIncomeDto dto)
        {
            var userId = _userService.GetUserId();

            var existing = await _context.Incomes.Include(i => i.Category)
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

        // Delete an income by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(Guid id)
        {
            var userId = _userService.GetUserId();

            var income = await _context.Incomes
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

            if (income == null) return NotFound();

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
