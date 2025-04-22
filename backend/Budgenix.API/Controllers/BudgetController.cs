using Microsoft.AspNetCore.Mvc;
using Budgenix.Models.Shared;
using Budgenix.Dtos;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using System;
using Budgenix.Models.Budgeting;
using Budgenix.Models.Transactions;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : Controller
    {
        private readonly BudgenixDbContext _context;

        public BudgetController(BudgenixDbContext context)
        {
            _context = context;
        }

        //[HttpGet]
        //public async Task<ActionResult> GetBudgets(
        //    DateTime? from = null,
        //    DateTime? to = null,
        //    string? category = null,
        //    string sort = "date_desc",
        //    string? groupBy = null,
        //    int skip = 0,
        //    int take = 100)
        //{
        //    var budgets = _context.Budgets.AsQueryable();


        //    if (from.HasValue)
        //        budgets = budgets.Where(b => b.Da)

        //}

        // Get a single expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> GetBudgetById(Guid id)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id);
            if (budget == null)
                return NotFound();
            return Ok(budget);
        }

        [HttpPost]
        public async Task<ActionResult> AddBudget(Budget budget)
        {
            var nameConflict = _context.Budgets.Any(b => 
                b.Id != budget.Id &&
                b.Name.ToLower() == budget.Name.ToLower());

            if (nameConflict)
            {
                // You could log this, or return a 200/201 with a warning payload
                Console.WriteLine($"Warning: Another budget exists with the name '{budget.Name}'");
            }

            var ruleConflict = _context.Budgets.Any(existing => 
               existing.Id != budget.Id &&
               existing.Category.ToLower() == budget.Category.ToLower() &&
               existing.Type == budget.Type &&
               existing.Recurrence == budget.Recurrence &&
               (existing.EndDate == null || budget.StartDate <= existing.EndDate) &&
               (existing.EndDate == null || budget.EndDate >= existing.StartDate)
            );

            if (ruleConflict)
            {
                return BadRequest("A conflicting budget rule already exists for this category, type, and time period.");
            }            

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, budget);
        }


        // Delete an expense by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(Guid id)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null)
                return NotFound();

            _context.Budgets.Remove(budget);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
