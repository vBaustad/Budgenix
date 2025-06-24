using AutoMapper;
using Budgenix.Dtos.Recurring;
using Budgenix.Dtos.Expenses;
using Budgenix.Services.Recurring;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Mvc;
using Budgenix.Models.Shared;
using Microsoft.AspNetCore.Authorization;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RecurringController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRecurringService _recurringService;

        public RecurringController(IUserService userService, IRecurringService recurringService)
        {
            _userService = userService;
            _recurringService = recurringService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<RecurringItemDto>>>> GetAll()
        {
            var userId = _userService.GetUserId();
            var result = await _recurringService.GetAllAsync(userId);
            return Ok(ApiResponse<IEnumerable<RecurringItemDto>>.Success(result, "Fetched all recurring items"));
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<ApiResponse<IEnumerable<RecurringItemDto>>>> GetUpcoming([FromQuery] int daysAhead = 30)
        {
            var userId = _userService.GetUserId();
            var result = await _recurringService.GetUpcomingAsync(userId, daysAhead);
            return Ok(ApiResponse<IEnumerable<RecurringItemDto>>.Success(result, $"Fetched upcoming items for next {daysAhead} days"));
        }

        [HttpGet("overview")]
        public async Task<ActionResult<ApiResponse<RecurringOverviewDto>>> GetOverview([FromQuery] int month, [FromQuery] int year)
        {
            var userId = _userService.GetUserId();
            var result = await _recurringService.GetOverviewAsync(userId, month, year);
            return Ok(ApiResponse<RecurringOverviewDto>.Success(result, "Fetched overview"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RecurringItemDto>>> GetById(Guid id)
        {
            var userId = _userService.GetUserId();
            var result = await _recurringService.GetByIdAsync(userId, id);
            if (result == null)
                return NotFound(ApiResponse<RecurringItemDto>.Fail("Recurring item not found", 404));

            return Ok(ApiResponse<RecurringItemDto>.Success(result, "Fetched recurring item"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<RecurringItemDto>>> Create([FromBody] CreateRecurringItemDto dto)
        {
            var userId = _userService.GetUserId();
            var created = await _recurringService.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                ApiResponse<RecurringItemDto>.Success(created, "Created recurring item", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<RecurringItemDto>>> Update(Guid id, [FromBody] UpdateRecurringItemDto dto)
        {
            var userId = _userService.GetUserId();
            var updated = await _recurringService.UpdateAsync(userId, id, dto);
            if (updated == null)
                return NotFound(ApiResponse<RecurringItemDto>.Fail("Recurring item not found", 404));

            return Ok(ApiResponse<RecurringItemDto>.Success(updated, "Updated recurring item"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id)
        {
            var userId = _userService.GetUserId();
            var success = await _recurringService.DeleteAsync(userId, id);
            if (!success)
                return NotFound(ApiResponse<object>.Fail("Recurring item not found", 404));

            return Ok(ApiResponse<object>.Success(null, "Deleted recurring item"));
        }

        [HttpPost("{id}/trigger")]
        public async Task<ActionResult<ApiResponse<ExpenseDto>>> Trigger(Guid id)
        {
            var userId = _userService.GetUserId();
            var result = await _recurringService.TriggerAsync(userId, id);
            if (result == null)
                return NotFound(ApiResponse<ExpenseDto>.Fail("Recurring item not found or could not trigger", 404));

            return Ok(ApiResponse<ExpenseDto>.Success(result, "Triggered recurring item"));
        }

        [HttpPost("{id}/skip")]
        public async Task<ActionResult<ApiResponse<object>>> Skip(Guid id, [FromQuery] DateTime? occurrenceDate = null)
        {
            var userId = _userService.GetUserId();
            var success = await _recurringService.SkipAsync(userId, id, occurrenceDate);
            if (!success)
                return NotFound(ApiResponse<object>.Fail("Recurring item not found or could not skip", 404));

            return Ok(ApiResponse<object>.Success(null, "Skipped occurrence"));
        }
    }
}
