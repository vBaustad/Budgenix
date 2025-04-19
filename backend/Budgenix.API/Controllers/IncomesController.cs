using Microsoft.AspNetCore.Mvc;
using Budgenix.Services;
using Budgenix.Dtos;
using Budgenix.Helpers.Query;
using Budgenix.Models;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomesController : Controller
    {
        private readonly BudgenixDbContext _context;

        public IncomesController(BudgenixDbContext context)
        {
            _context = context;
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<Income>>> GetIncomes(
            DateTime? from = null,
            DateTime? to = null,
            string? category = null,
            string sort = "date_desc",
            string? groupBy = null,
            int skip = 0,
            int take = 100)
        {

            var incomes = _context.Incomes.AsQueryable();

            //Apply filters and sorting
            incomes = IncomeQueryHelper.ApplyFilters(incomes, from, to, category);
            incomes = IncomeQueryHelper.ApplySorting(incomes, sort);

            //Apply grouping
            if (!string.IsNullOrWhiteSpace(groupBy))
            {
                var groupByKey = groupBy.ToLower();

                if (groupByKey != "month" && groupByKey != "category" && groupByKey != "year")
                    return BadRequest("Invalid groupBy value. Use 'month', 'category', or 'year'.");

                var grouped = IncomeQueryHelper.ApplyGrouping(incomes, groupByKey);
                return  Ok(grouped.ToList());
            }

            // Pagination
            var results = await incomes.Skip(skip).Take(take).ToListAsync();

            return Ok(results);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Expense>>> SearchIncomes(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(_context.Incomes);

            var matches = await _context.Incomes
                .Where(i => (!string.IsNullOrEmpty(i.Name) && i.Name.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(i.Description) && i.Description.Contains(query, StringComparison.OrdinalIgnoreCase)))
                .ToListAsync();
            return Ok(matches);
        }

        // Get a single income by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncomeById(Guid id)
        {
            var result = await _context.Incomes.FirstOrDefaultAsync(e => e.Id == id);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetTotalIncome()
        {
            var total = await _context.Incomes.SumAsync(i => i.Amount);
            return Ok(total);
        }

        [HttpGet("recurring-upcoming")]
        public async Task<ActionResult<IEnumerable<Income>>> GetUpcomingRecurringIncomes(int daysAhead = 30)
        {
            var upcoming = await _context.Incomes
                .Where(i => i.IsRecurring && i.Date >= DateTime.Today && i.Date <= DateTime.Today.AddDays(daysAhead))
                .ToListAsync();

            return Ok(upcoming);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsedIncomeCategories()
        {
            var categories = await _context.Incomes
                .Where(i => i.Category != null)
                .Select(i => i.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToListAsync();

            return Ok(categories);
        }

        // Create a new income and return it with a new ID
        [HttpPost]
        public async Task<ActionResult> AddIncome(CreateIncomeDto dto)
        {
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Invalid category ID.");

            var income = new Income
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                Amount = dto.Amount,
                Date = dto.Date,
                Category = category,
                IsRecurring = dto.IsRecurring,
                RecurrenceFrequency = dto.RecurrenceFrequency,
                Notes = dto.Notes,
            };

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIncomeById), new { id = income.Id }, income);
        }

        // Update an existing income by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome(Guid id, Income updated)
        {
            var existing = await _context.Incomes.FirstOrDefaultAsync(x => x.Id == id);

            if(existing == null) return NotFound();

            existing.Name = updated.Name;
            existing.Description = updated.Description;
            existing.Category = updated.Category;
            existing.Date = updated.Date;
            existing.RecurrenceFrequency = updated.RecurrenceFrequency;
            existing.IsRecurring = updated.IsRecurring;
            existing.Amount = updated.Amount;
            existing.Notes = updated.Notes;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Delete an income by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(Guid id)
        {
            var income = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);
            if(income == null) return NotFound();

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
