using Microsoft.AspNetCore.Mvc;
using Budgenix.Models;
using Budgenix.Data;

namespace Budgenix.API.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private AppData _appData = DataStore.Load();
        private static int _nextId = 1;


        // Get all expenses (optionally filter by date or category)
        [HttpGet]
        public ActionResult<IEnumerable<Expense>> GetExpenses(
            DateTime? from = null,
            DateTime? to = null,
            string? category = null,
            string? sort = null,
            int skip = 0,
            int take = 100
            )
        {
            var result = _appData.Expenses.AsEnumerable();

            // Filter: date range
            if (from.HasValue)
                result = result.Where(e => e.Date >= from.Value);
            if (to.HasValue)
                result = result.Where(e => e.Date <= to.Value);

            // Filter: category
            if (!string.IsNullOrWhiteSpace(category))
                result = result.Where(e => e.Category?.Name?.Equals(category, StringComparison.OrdinalIgnoreCase) == true);

            // Sort
            if (!string.IsNullOrEmpty(sort))
            {
                result = sort.ToLower() switch
                {
                    "date_asc" => result.OrderBy(e => e.Date),
                    "date_desc" => result.OrderByDescending(e => e.Date),
                    "amount_asc" => result.OrderBy(e => e.Amount),
                    "amount_desc" => result.OrderByDescending(e => e.Amount),
                    "name_asc" => result.OrderBy(e => e.Name),
                    "name_desc" => result.OrderByDescending(e => e.Name),
                    _ => result
                };
            }

            // Pagination
            result = result.Skip(skip).Take(take);


            return Ok(result);
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<Expense>> SearchExpenses(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(_appData.Expenses);

            var matches = _appData.Expenses
                .Where(e => (!string.IsNullOrEmpty(e.Name) && e.Name.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(e.Description) && e.Description.Contains(query, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            return Ok(matches);
        }

        [HttpGet("total")]
        public ActionResult<decimal> GetTotalAmount()
        {
            var total = _appData.Expenses.Sum(e => e.Amount);
            return Ok(total);
        }

        [HttpGet("recurring-upcoming")]
        public ActionResult<IEnumerable<Expense>> GetUpcomingRecurringExpenses(int daysAhead = 30)
        {
            var upcoming = _appData.Expenses
                .Where(e => e.IsRecurring && e.Date >= DateTime.Today && e.Date <= DateTime.Today.AddDays(daysAhead))
                .ToList();
            return Ok(upcoming);
        }

        [HttpGet("categories")]
        public ActionResult<IEnumerable<string>> GetUsedExpenseCategories()
        {
            var categories = _appData.Expenses
                .Where(e => e.Category != null)
                .Select(e => e.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToList();

            return Ok(categories);
        }

        // Get a single expense by ID
        [HttpGet("{id}")]
        public ActionResult<Expense> GetExpenseById(Guid id)
        {
            var expense = _appData.Expenses.FirstOrDefault(e => e.Id == id);
            if (expense == null)
                return NotFound();
            return Ok(expense);           
        }



        // Create a new expense and return it with a new ID
        [HttpPost]
        public ActionResult AddExpense(Expense expense)
        {
            expense.Id = Guid.NewGuid();
            _appData.Expenses.Add(expense);
            DataStore.Save(_appData);

            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }






        // Update an existing expense by ID
        [HttpPut("{id}")]
        public IActionResult UpdateExpense(Guid id, Expense updated) 
        {
            var existing = _appData.Expenses.FirstOrDefault(e =>e.Id == id);
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

            DataStore.Save(_appData);

            return NoContent();
        }







        // Delete an expense by ID
        [HttpDelete("{id}")]
        public IActionResult DeleteExpense(Guid id) 
        {
            var expense = _appData.Expenses.FirstOrDefault(e => e.Id == id);

            if (expense == null) 
                return NotFound();

            _appData.Expenses.Remove(expense);
            DataStore.Save(_appData);

            return NoContent();
        }
    }
}
