using Budgenix.Dtos.Goals;

namespace Budgenix.Services.Goals
{
    public interface IGoalService
    {
        Task<IEnumerable<GoalDto>> GetAllGoalsAsync(string userId);
        Task<GoalDto?> GetGoalByIdAsync(string userId, Guid goalId);
        Task<GoalDto> CreateGoalAsync(string userId, CreateGoalDto dto);
        Task<GoalDto?> UpdateGoalAsync(string userId, Guid goalId, UpdateGoalDto dto);
        Task<bool> DeleteGoalAsync(string userId, Guid goalId);
        Task<GoalDto?> ContributeToGoalAsync(string userId, Guid goalId, GoalContributionDto dto);
    }
}
