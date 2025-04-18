using Microsoft.AspNetCore.Mvc;
using Budgenix.Data;
using Budgenix.Models;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomesController : Controller
    {
        private AppData _appData = DataStore.Load();

        [HttpGet]
        public ActionResult<Income> GetIncomes()
        {
           var data = _appData.Incomes;
            return View(data);
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<Expense>> SearchIncomes(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(_appData.Incomes);

            var matches = _appData.Incomes
                .Where(i => (!string.IsNullOrEmpty(i.Name) && i.Name.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(i.Description) && i.Description.Contains(query, StringComparison.OrdinalIgnoreCase)))
                .ToList();
            return Ok(matches);
        }

        [HttpGet("{id}")]
        public IActionResult GetIncomesById(Guid id)
        {
            var result = _appData.Incomes.FirstOrDefault(e => e.Id == id);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("total")]
        public ActionResult<decimal> GetTotalIncome()
        {
            var total = _appData.Incomes.Sum(i => i.Amount);
            return Ok(total);
        }

        [HttpGet("recurring-upcoming")]
        public ActionResult<IEnumerable<Income>> GetUpcomingRecurringIncomes(int daysAhead = 30)
        {
            var upcoming = _appData.Incomes
                .Where(i => i.IsRecurring && i.Date >= DateTime.Today && i.Date <= DateTime.Today.AddDays(daysAhead))
                .ToList();

            return Ok(upcoming);
        }

        [HttpGet("categories")]
        public ActionResult<IEnumerable<string>> GetUsedIncomeCategories()
        {
            var categories = _appData.Incomes
                .Where(i => i.Category != null)
                .Select(i => i.Category.Name)
                .Distinct()
                .OrderBy(name => name)
                .ToList();

            return Ok(categories);
        }

        [HttpPost]
        public ActionResult addIncome(Income income)
        {
            income.Id = Guid.NewGuid();
            _appData.Incomes.Add(income);
            DataStore.Save(_appData);

            return CreatedAtAction(nameof(GetIncomes), new { id = income.Id }, income);
        }



        [HttpPut("{id}")]
        public IActionResult UpdateIncome(Guid id, Income updated)
        {
            var existing = _appData.Incomes.FirstOrDefault(x => x.Id == id);

            if(existing == null) return NotFound();

            existing.Name = updated.Name;
            existing.Description = updated.Description;
            existing.Category = updated.Category;
            existing.Date = updated.Date;
            existing.RecurrenceFrequency = updated.RecurrenceFrequency;
            existing.IsRecurring = updated.IsRecurring;
            existing.Amount = updated.Amount;
            existing.Notes = updated.Notes;

            DataStore.Save(_appData);
            return NoContent();
        }




        [HttpDelete("{id}")]
        public IActionResult DeleteIncome(Guid id)
        {
            var income = _appData.Incomes.FirstOrDefault(i => i.Id == id);
            if(income == null) return NotFound();

            _appData.Incomes.Remove(income);
            DataStore.Save(_appData);
            return NoContent();
        }

    }
}
