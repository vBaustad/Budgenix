using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Budgenix.Data;
using Budgenix.Dtos.Goals;
using Budgenix.Models.Finance;
using Budgenix.Services;
using AutoMapper;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase
    {
        private readonly BudgenixDbContext _context;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public GoalsController(BudgenixDbContext context, IUserService userService, IMapper mapper)
        {
            _context = context;
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoalDto>>> GetGoals()
        {
            var userId = _userService.GetUserId();
            var goals = await _context.Goals.Where(g => g.UserId == userId).ToListAsync();
            return Ok(_mapper.Map<List<GoalDto>>(goals));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GoalDto>> GetGoal(Guid id)
        {
            var userId = _userService.GetUserId();
            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound();
            return Ok(_mapper.Map<GoalDto>(goal));
        }

        [HttpPost]
        public async Task<ActionResult<GoalDto>> CreateGoal([FromBody] CreateGoalDto dto)
        {
            var userId = _userService.GetUserId();
            var goal = _mapper.Map<Goal>(dto);
            goal.Id = Guid.NewGuid();
            goal.UserId = userId;
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGoal), new { id = goal.Id }, _mapper.Map<GoalDto>(goal));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(Guid id, [FromBody] UpdateGoalDto dto)
        {
            var userId = _userService.GetUserId();
            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound();
            _mapper.Map(dto, goal);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(Guid id)
        {
            var userId = _userService.GetUserId();
            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound();
            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
