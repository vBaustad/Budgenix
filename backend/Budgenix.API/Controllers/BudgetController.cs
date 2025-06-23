using Microsoft.AspNetCore.Mvc;
using Budgenix.Services.Budgets;
using Budgenix.Dtos.Budgets;
using Budgenix.Models.Shared;
using Microsoft.AspNetCore.Authorization;
using Budgenix.Services.User;
using Budgenix.Models.Finance;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly IBudgetService _budgetService;
        private readonly IUserService _userService;

        public BudgetController(IBudgetService budgetService, IUserService userService)
        {
            _budgetService = budgetService;
            _userService = userService;
        }

        // =======================================
        // ========== GET APIs ==================
        // =======================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetDto>>> GetBudgets(
            string? category = null,
            BudgetTypeEnum? type = null,
            string sort = "date_desc",
            int skip = 0,
            int take = 100)
        {
            var userId = _userService.GetUserId();
            var budgets = await _budgetService.GetBudgetsAsync(userId, category, type, sort, skip, take);
            return Ok(budgets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetDto>> GetBudgetById(Guid id)
        {
            var userId = _userService.GetUserId();
            var budget = await _budgetService.GetBudgetByIdAsync(userId, id);
            if (budget == null)
                return NotFound();
            return Ok(budget);
        }

        [HttpGet("progress")]
        public async Task<ActionResult<IEnumerable<BudgetProgressDto>>> GetAllBudgetProgress()
        {
            var userId = _userService.GetUserId();
            var progress = await _budgetService.GetAllBudgetProgressAsync(userId);
            return Ok(progress);
        }

        [HttpGet("{id}/progress")]
        public async Task<ActionResult<BudgetProgressDto>> GetBudgetProgress(Guid id)
        {
            var userId = _userService.GetUserId();
            var progress = await _budgetService.GetBudgetProgressAsync(userId, id);
            if (progress == null)
                return NotFound();
            return Ok(progress);
        }

        // =======================================
        // ========== POST API ==================
        // =======================================

        [HttpPost]
        public async Task<ActionResult<BudgetDto>> AddBudget(CreateBudgetDto dto)
        {
            var userId = _userService.GetUserId();
            try
            {
                var created = await _budgetService.CreateBudgetAsync(userId, dto);
                return CreatedAtAction(nameof(GetBudgetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // =======================================
        // ========== PUT API ===================
        // =======================================

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(Guid id, UpdateBudgetDto dto)
        {
            var userId = _userService.GetUserId();

            if (id != dto.Id)
                return BadRequest("ID mismatch");

            try
            {
                var updated = await _budgetService.UpdateBudgetAsync(userId, dto);
                if (updated == null)
                    return NotFound();

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // =======================================
        // ========== DELETE API ================
        // =======================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(Guid id)
        {
            var userId = _userService.GetUserId();
            var deleted = await _budgetService.DeleteBudgetAsync(userId, id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
