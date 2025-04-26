using Microsoft.AspNetCore.Mvc;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using Budgenix.Models.Finance;
using Budgenix.Dtos.Budgets;
using Budgenix.Services;
using AutoMapper;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public BudgetController(BudgenixDbContext context, IUserService userService, IMapper mapper)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
        }

        // Get a single expense by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetDto>> GetBudgetById(Guid id)
        {
            var userId = _userService.GetUserId();

            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null)
                return NotFound();

            var budgetDto = _mapper.Map<BudgetDto>(budget);
            return Ok(budgetDto);
        }

        [HttpPost]
        public async Task<ActionResult> AddBudget(CreateBudgetDto dto)
        {
            var userId = _userService.GetUserId();

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Invalid category ID");

            // Duplicate detection logic
            const decimal allowedAmountDifferencePercentage = 0.01m; // 1%
            var similarBudgetExists = await _context.Budgets
                .AsNoTracking()
                .AnyAsync(b =>
                    b.UserId == userId &&
                    b.CategoryId == dto.CategoryId &&
                    string.Equals(b.Name, dto.Name, StringComparison.OrdinalIgnoreCase) &&
                    (
                        (!b.EndDate.HasValue || !dto.EndDate.HasValue) ||
                        (b.StartDate <= dto.EndDate && (b.EndDate ?? DateTime.MaxValue) >= dto.StartDate)
                    ) &&
                    Math.Abs(b.AllocatedAmount - dto.AllocatedAmount) <= dto.AllocatedAmount * allowedAmountDifferencePercentage
                );

            if (similarBudgetExists)
            {
                return BadRequest("A similar budget already exists for this category, name, date range, and amount.");
            }

            var budget = _mapper.Map<Budget>(dto);
            budget.Id = Guid.NewGuid();
            budget.Category = category;
            budget.UserId = userId;

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            var budgetDto = _mapper.Map<BudgetDto>(budget);

            return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, budgetDto);
        }


        // Delete an expense by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(Guid id)
        {
            var userId = _userService.GetUserId();

            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null)
                return NotFound();

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
