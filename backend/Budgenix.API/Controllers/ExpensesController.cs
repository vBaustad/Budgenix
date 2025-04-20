using Microsoft.AspNetCore.Mvc;
using Budgenix.Services;
using Budgenix.Dtos;
using Budgenix.Models;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using System;
using Budgenix.API.Models.Transactions;

namespace Budgenix.API.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly BudgenixDbContext _context;

        public ExpensesController(BudgenixDbContext context)
        {
            _context = context;
        }



        // Get all expenses (optionally filter by date or category)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses(
            DateTime? from = null,
            DateTime? to = null,
            string? category = null,
            string sort = "date_desc",
            string? groupBy = null,
            int skip = 0,
            int take = 100
            )
        {
            var expenses = _context.Expenses.AsQueryable();

            // Filter: date range
            if (from.HasValue)
                expenses = expenses.Where(e => e.Date >= from.Value);
            if (to.HasValue)
                expenses = expenses.Where(e => e.Date <= to.Value);

            // Filter: category
            if (!string.IsNullOrWhiteSpace(category))
                expenses = expenses.Where(e => string.Equals(e.Category.Name, category, StringComparison.OrdinalIgnoreCase)
            );

            // Sort            
            expenses = sort.ToLower() switch
            {
                "date_asc" => expenses.OrderBy(e => e.Date),
                "date_desc" => expenses.OrderByDescending(e => e.Date),
                "amount_asc" => expenses.OrderBy(e => e.Amount),
                "amount_desc" => expenses.OrderByDescending(e => e.Amount),
                "name_asc" => expenses.OrderBy(e => e.Name),
                "name_desc" => expenses.OrderByDescending(e => e.Name),
                _ => expenses.OrderByDescending(i => i.Date),
            };

            // Pagination
            var results = await expenses.Skip(skip).Take(take).ToListAsync();
            return Ok(results);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Expense>>> SearchExpenses(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(await _context.Expenses.ToListAsync());

            var matches = await _context.Expenses
                .Where(e =>
                    (!string.IsNullOrEmpty(e.Name) && e.Name.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrEmpty(e.Description) && e.Description.Contains(query, StringComparison.OrdinalIgnoreCase)))
                .ToListAsync();

            return Ok(matches);
        }

        [HttpGet("total")]
        public async Task<ActionResult<decimal>> GetTotalAmount()
        {
            var total = await _context.Expenses.SumAsync(e => e.Amount);
            return Ok(total);
        }

        [HttpGet("recurring-upcoming")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetUpcomingRecurringExpenses(int daysAhead = 30)
        {
            var upcoming = await _context.Expenses
                .Where(e => e.IsRecurring && e.Date >= DateTime.Today && e.Date <= DateTime.Today.AddDays(daysAhead))
                .ToListAsync();
            return Ok(upcoming);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsedExpenseCategories()
        {
            var categories = await _context.Expenses
                .Where(e => e.Category != null)
                .Select(e => e.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToListAsync();

            return Ok(categories);
        }

        // Get a single expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpenseById(Guid id)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);
            if (expense == null)
                return NotFound();
            return Ok(expense);           
        }



        // Create a new expense and return it with a new ID
        [HttpPost]
        public async Task<ActionResult> AddExpense(Expense expense)
        {
            expense.Id = Guid.NewGuid();
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, expense);
        }






        // Update an existing expense by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(Guid id, Expense updated) 
        {
            var existing = await _context.Expenses.FirstOrDefaultAsync(e =>e.Id == id);
            if(existing == null)
                return NotFound();

            //Update Fields
            existing.Name = updated.Name;
            existing.Description = updated.Description;
            existing.Amount = updated.Amount;
            existing.Category = updated.Category;
            existing.Date = updated.Date;
            existing.IsRecurring = updated.IsRecurring;
            existing.RecurrenceFrequency = updated.RecurrenceFrequency;
            existing.Notes = updated.Notes;

            await _context.SaveChangesAsync();

            return NoContent();
        }





        // Delete an expense by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id) 
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);

            if (expense == null) 
                return NotFound();

            _context.Expenses.Remove(expense);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
