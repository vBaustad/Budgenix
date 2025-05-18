using AutoMapper;
using Budgenix.Data;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;
using Budgenix.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Budgenix.Models.Finance;
using Budgenix.Dtos.Expenses;

[ApiController]
[Route("api/[controller]")]
public class RecurringController : Controller
{
    private readonly BudgenixDbContext _context;
    private readonly IUserService _userService;
    private readonly RecurringItemService _service;
    private readonly IMapper _mapper;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public RecurringController(
        IUserService userService,
        BudgenixDbContext context,
        RecurringItemService service,
        IMapper mapper,
        IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _userService = userService;
        _service = service;
        _mapper = mapper;
        _localizer = localizer;
    }

    [HttpGet("upcoming")]
    public ActionResult<IEnumerable<RecurringItemDto>> GetUpcoming()
    {
        var userId = _userService.GetUserId();
        var today = DateTime.Today;

        var items = _context.RecurringItems
            .Where(x => x.UserId == userId && x.IsActive)
            .ToList();

        var result = items.Select(item => new RecurringItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Amount = item.Amount,
            StartDate = item.StartDate,
            EndDate = item.EndDate,
            Frequency = item.Frequency,
            IsActive = item.IsActive,
            Type = item.Type,
            CategoryId = item.CategoryId,
            LastTriggeredDate = item.LastTriggeredDate,
            LastSkippedDate = item.LastSkippedDate,
            NextOccurrenceDate = _service.GetNextOccurrenceDate(item, today)
        });

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateRecurringItem(Guid id, [FromBody] UpdateRecurringItemDto dto)
    {
        var userId = _userService.GetUserId();
        var item = await _context.RecurringItems.FindAsync(id);

        if (item == null || item.UserId != userId)
            return NotFound();

        item.Name = dto.Name;
        item.Description = dto.Description ?? string.Empty;
        item.Amount = dto.Amount;
        item.StartDate = dto.StartDate;
        item.EndDate = dto.EndDate;
        item.Frequency = dto.Frequency;
        item.IsActive = dto.IsActive;
        item.Type = dto.Type;
        item.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();
        return NoContent();
    }



    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRecurringItem(Guid id)
    {
        var userId = _userService.GetUserId();
        var item = await _context.RecurringItems.FindAsync(id);

        if (item == null || item.UserId != userId)
            return NotFound();

        _context.RecurringItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<RecurringItemDto>> CreateRecurringItem([FromBody] CreateRecurringItemDto dto)
    {
        var userId = _userService.GetUserId();

        var entity = new RecurringItem
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description ?? string.Empty,
            Amount = dto.Amount,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Frequency = dto.Frequency,
            IsActive = dto.IsActive,
            Type = dto.Type,
            CategoryId = dto.CategoryId,
            UserId = userId
        };

        _context.RecurringItems.Add(entity);
        await _context.SaveChangesAsync();

        var today = DateTime.Today;
        var result = new RecurringItemDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Amount = entity.Amount,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            Frequency = entity.Frequency,
            IsActive = entity.IsActive,
            Type = entity.Type,
            CategoryId = entity.CategoryId,
            NextOccurrenceDate = _service.GetNextOccurrenceDate(entity, today)
        };

        return CreatedAtAction(nameof(GetUpcoming), new { id = entity.Id }, result);
    }

    [HttpPost("{id}/trigger")]
    public async Task<ActionResult<ExpenseDto>> TriggerRecurringItem(Guid id)
    {
        var userId = _userService.GetUserId();
        var item = await _context.RecurringItems.FindAsync(id);

        if (item == null || item.UserId != userId)
            return NotFound();

        if (item.CategoryId == null)
            return BadRequest("Recurring item must have a category.");

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Name = item.Name,
            Description = item.Description,
            Amount = item.Amount,
            Date = DateTime.Today,
            CategoryId = item.CategoryId.Value,
            IsRecurring = true,
            RecurrenceFrequency = item.Frequency,
            UserId = userId,
            Notes = "Triggered from recurring item"
        };

        item.LastTriggeredDate = DateTime.Today;
        _service.AdvanceStartDate(item);

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        var result = _mapper.Map<ExpenseDto>(expense);
        return Ok(result);
    }


    [HttpPost("{id}/skip")]
    public async Task<ActionResult> SkipNextOccurrence(Guid id)
    {
        var userId = _userService.GetUserId();
        var item = await _context.RecurringItems.FindAsync(id);

        if (item == null || item.UserId != userId)
            return NotFound();

        item.LastSkippedDate = DateTime.Today;

        _service.AdvanceStartDate(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
