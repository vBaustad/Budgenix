using Budgenix.Services.Recurring;
using Budgenix.Services;
using Microsoft.AspNetCore.Mvc;
using Budgenix.Dtos.Recurring;
using AutoMapper;
using Budgenix.Data;
using Budgenix.Models.Shared;
using Microsoft.Extensions.Localization;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecurringController : Controller
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly RecurringItemService _service;
        private readonly IMapper _mapper;
        private readonly IStringLocalizer<SharedResource> _localizer;

        public RecurringController(IUserService userService, BudgenixDbContext context, RecurringItemService service, IMapper mapper, IStringLocalizer<SharedResource> localizer)
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
                Amount = item.Amount,
                StartDate = item.StartDate,
                Frequency = item.Frequency,
                NextOccurrenceDate = _service.GetNextOccurrenceDate(item, today)
            });

            return Ok(result);
        }
    }
}
