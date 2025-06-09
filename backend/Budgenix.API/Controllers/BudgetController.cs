using Microsoft.AspNetCore.Mvc;
using Budgenix.Data;
using Microsoft.EntityFrameworkCore;
using Budgenix.Models.Finance;
using Budgenix.Dtos.Budgets;
using Budgenix.Services;
using AutoMapper;
using Budgenix.Dtos.Expenses;
using Budgenix.Helpers.Query;
using Microsoft.AspNetCore.Authorization;
using Budgenix.Models.Shared;
using Microsoft.Extensions.Localization;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer<SharedResource> _localizer;

        public BudgetController(BudgenixDbContext context, IUserService userService, IMapper mapper, IStringLocalizer<SharedResource> localizer)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
            _localizer = localizer;
        }

        // =======================================
        // ==========      GET APIs      =========
        // =======================================

        //Get all budgets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetDto>>> GetBudgets(           
            string? category = null,
            BudgetTypeEnum? type = null,
            string sort = "date_desc",
            string? groupBy = null,
            int skip = 0,
            int take = 100)
        {
            var userId = _userService.GetUserId();

            var budgets = _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.UserId == userId)
                .AsQueryable();

            budgets = BudgetQueryHelper.ApplyFilters(budgets, category, type);

            // Pagination
            var results = await budgets.Skip(skip).Take(take).ToListAsync();

            var budgetDto = _mapper.Map<List<BudgetDto>>(results);

            return Ok(budgetDto);
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

        [HttpGet("{id}/progress")]
        public async Task<ActionResult<BudgetProgressDto>> GetBudgetProgress(Guid id)
        {
            var userId = _userService.GetUserId();

            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

            if (budget == null)
                return NotFound();

            var start = budget.StartDate;
            var end = budget.EndDate ?? DateTime.Today;

            var totalSpent = await _context.Expenses
                .Where(e => e.UserId == userId &&
                            e.CategoryId == budget.CategoryId &&
                            e.Date >= start &&
                            e.Date <= end)
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var progressDto = new BudgetProgressDto
            {
                Id = budget.Id,
                Name = budget.Name,
                AllocatedAmount = budget.AllocatedAmount,
                TotalSpent = totalSpent,
            };

            return Ok(progressDto);
        }


        [HttpGet("progress")]
        public async Task<ActionResult<IEnumerable<BudgetProgressDto>>> GetAllBudgetProgress()
        {
            var userId = _userService.GetUserId();

            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            var progressDtos = new List<BudgetProgressDto>();

            foreach (var budget in budgets)
            {
                var start = budget.StartDate;
                var end = budget.EndDate ?? DateTime.Today;

                var totalSpent = await _context.Expenses
                    .Where(e => e.UserId == userId &&
                                e.CategoryId == budget.CategoryId &&
                                e.Date >= start &&
                                e.Date <= end)
                    .SumAsync(e => (decimal?)e.Amount) ?? 0;

                var progress = new BudgetProgressDto
                {
                    Id = budget.Id,
                    Name = budget.Name,
                    AllocatedAmount = budget.AllocatedAmount,
                    TotalSpent = totalSpent,
                };

                progressDtos.Add(progress);
            }

            return Ok(progressDtos);
        }


        // =======================================
        // ==========     POST APIs      =========
        // =======================================

        [HttpPost]
        public async Task<ActionResult> AddBudget(CreateBudgetDto dto)
        {
            var userId = _userService.GetUserId();

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest(_localizer["Shared_InvalidCategoryId"]);

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
                return BadRequest(_localizer["Budget_ConflictSimilarExists"]);
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

        // =======================================
        // ==========     PUT APIs       =========
        // =======================================

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(UpdateBudgetDto dto)
        {
            var userId = _userService.GetUserId();

            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == dto.Id && b.UserId == userId);
            if(budget == null)
                return NotFound();

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest(_localizer["Shared_InvalidCategoryId"]);

            const decimal allowedAmountdifferencePercentage = 0.01m; // 1%
            var similarBudgetExists = await _context.Budgets
                .AsNoTracking()
                .AnyAsync(b =>
                    b.Id != dto.Id &&
                    b.UserId == userId &&
                    b.CategoryId == dto.CategoryId &&
                    string.Equals(b.Name, dto.Name, StringComparison.OrdinalIgnoreCase) &&
                    (
                        (!b.EndDate.HasValue || !dto.EndDate.HasValue) ||
                        (b.StartDate <= dto.EndDate && (b.EndDate ?? DateTime.MaxValue) >= dto.StartDate)
                    ) &&
                    Math.Abs(b.AllocatedAmount - dto.AllocatedAmount) <= dto.AllocatedAmount * allowedAmountdifferencePercentage
                );

            if (similarBudgetExists)
                return BadRequest(_localizer["Budget_ConflictSimilarExists"]);


            _mapper.Map(dto, budget);
            budget.Category = category;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // =======================================
        // ==========    DELETE APIs     =========
        // =======================================

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
