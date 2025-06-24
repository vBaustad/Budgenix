using Budgenix.Dtos.Goals;
using Budgenix.Services.Goals;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase
    {
        private readonly IGoalService _goalService;
        private readonly IUserService _userService;

        public GoalsController(IGoalService goalService, IUserService userService)
        {
            _goalService = goalService;
            _userService = userService;
        }

        // GET api/goals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoalDto>>> GetAllGoals()
        {
            var userId = _userService.GetUserId();
            var goals = await _goalService.GetAllGoalsAsync(userId);
            return Ok(goals);
        }

        // GET api/goals/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GoalDto>> GetGoalById(Guid id)
        {
            var userId = _userService.GetUserId();
            var goal = await _goalService.GetGoalByIdAsync(userId, id);

            if (goal == null)
                return NotFound();

            return Ok(goal);
        }

        // POST api/goals
        [HttpPost]
        public async Task<ActionResult<GoalDto>> CreateGoal([FromBody] CreateGoalDto dto)
        {
            var userId = _userService.GetUserId();
            var createdGoal = await _goalService.CreateGoalAsync(userId, dto);
            return CreatedAtAction(nameof(GetGoalById), new { id = createdGoal.Id }, createdGoal);
        }

        // PUT api/goals/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<GoalDto>> UpdateGoal(Guid id, [FromBody] UpdateGoalDto dto)
        {
            var userId = _userService.GetUserId();
            var updatedGoal = await _goalService.UpdateGoalAsync(userId, id, dto);

            if (updatedGoal == null)
                return NotFound();

            return Ok(updatedGoal);
        }

        // DELETE api/goals/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGoal(Guid id)
        {
            var userId = _userService.GetUserId();
            var success = await _goalService.DeleteGoalAsync(userId, id);

            if (!success)
                return NotFound();

            return NoContent();
        }

        // POST api/goals/{id}/contribute
        [HttpPost("{id}/contribute")]
        public async Task<ActionResult<GoalDto>> ContributeToGoal(Guid id, [FromBody] GoalContributionDto dto)
        {
            var userId = _userService.GetUserId();
            var result = await _goalService.ContributeToGoalAsync(userId, id, dto);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}
