using Budgenix.Dtos.Goals;
using Budgenix.Data;
using Budgenix.Models.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Budgenix.Services.Audit;
using Budgenix.Models.Audit;
using System.Text.Json;
using Budgenix.Services.Shared;

namespace Budgenix.Services.Goals
{
    public class GoalService : IGoalService
    {
        private readonly BudgenixDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<GoalService> _logger;
        private readonly IAuditService _audit;
        private readonly ICacheInvalidatorService _cacheInvalidatorService;

        public GoalService(BudgenixDbContext context, IMemoryCache cache, ILogger<GoalService> logger, IAuditService audit, ICacheInvalidatorService cacheInvalidatorService)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _audit = audit;
            _cacheInvalidatorService = cacheInvalidatorService;
        }

        public async Task<IEnumerable<GoalDto>> GetAllGoalsAsync(string userId)
        {
            var cacheKey = $"goals:{userId}";
            if (_cache.TryGetValue(cacheKey, out IEnumerable<GoalDto> cachedGoals))
            {
                _logger.LogInformation("Serving cached goals for user {UserId}", userId);
                return cachedGoals;
            }

            var goals = await _context.Goals
                .Where(g => g.UserId == userId)
                .Select(g => new GoalDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    TargetAmount = g.TargetAmount,
                    CurrentAmount = g.CurrentAmount,
                    TargetDate = g.TargetDate,
                    IsActive = g.IsActive,
                    Icon = g.Icon
                })
                .ToListAsync();

            _cache.Set(cacheKey, goals, TimeSpan.FromMinutes(5));
            return goals;
        }

        public async Task<GoalDto?> GetGoalByIdAsync(string userId, Guid goalId)
        {
            var cacheKey = $"goal:{userId}:{goalId}";
            if (_cache.TryGetValue(cacheKey, out GoalDto cachedGoal))
            {
                _logger.LogInformation("Serving cached goal {GoalId} for user {UserId}", goalId, userId);
                return cachedGoal;
            }

            var g = await _context.Goals
                .Where(g => g.UserId == userId && g.Id == goalId)
                .FirstOrDefaultAsync();

            if (g == null) return null;

            var dto = ToDto(g);
            _cache.Set(cacheKey, dto, TimeSpan.FromMinutes(5));
            return dto;
        }

        public async Task<GoalDto> CreateGoalAsync(string userId, CreateGoalDto dto)
        {
            _logger.LogInformation("Creating goal for user {UserId}", userId);

            var goal = new Goal
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                TargetAmount = dto.TargetAmount,
                CurrentAmount = dto.CurrentAmount,
                TargetDate = dto.TargetDate,
                StartDate = DateTime.UtcNow,
                IsActive = true,
                UserId = userId,
                Icon = dto.Icon
            };

            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.CreateGoal,
                EntityType = "Goal",
                EntityId = goal.Id.ToString(),
                NewValues = JsonSerializer.Serialize(goal)
            });

            _cacheInvalidatorService.InvalidateGoals(userId, goal.Id);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return ToDto(goal);
        }

        public async Task<GoalDto?> UpdateGoalAsync(string userId, Guid goalId, UpdateGoalDto dto)
        {
            _logger.LogInformation("Updating goal {GoalId} for user {UserId}", goalId, userId);

            var goal = await _context.Goals
                .Where(g => g.UserId == userId && g.Id == goalId)
                .FirstOrDefaultAsync();

            if (goal == null) return null;

            var oldData = JsonSerializer.Serialize(goal);

            goal.Name = dto.Name;
            goal.Description = dto.Description;
            goal.TargetAmount = dto.TargetAmount;
            goal.CurrentAmount = dto.CurrentAmount;
            goal.TargetDate = dto.TargetDate;
            goal.Icon = dto.Icon;

            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.UpdateGoal,
                EntityType = "Goal",
                EntityId = goal.Id.ToString(),
                OldValues = oldData,
                NewValues = JsonSerializer.Serialize(goal)
            });

            _cacheInvalidatorService.InvalidateGoals(userId, goal.Id);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return ToDto(goal);
        }

        public async Task<bool> DeleteGoalAsync(string userId, Guid goalId)
        {
            _logger.LogInformation("Deleting goal {GoalId} for user {UserId}", goalId, userId);

            var goal = await _context.Goals
                .Where(g => g.UserId == userId && g.Id == goalId)
                .FirstOrDefaultAsync();

            if (goal == null) return false;

            var oldData = JsonSerializer.Serialize(goal);

            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.DeleteGoal,
                EntityType = "Goal",
                EntityId = goal.Id.ToString(),
                OldValues = oldData
            });

            _cacheInvalidatorService.InvalidateGoals(userId, goal.Id);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return true;
        }

        public async Task<GoalDto?> ContributeToGoalAsync(string userId, Guid goalId, GoalContributionDto dto)
        {
            _logger.LogInformation("Contributing to goal {GoalId} for user {UserId}", goalId, userId);

            var goal = await _context.Goals
                .Where(g => g.UserId == userId && g.Id == goalId)
                .FirstOrDefaultAsync();

            if (goal == null) return null;

            var previousAmount = goal.CurrentAmount;
            goal.CurrentAmount += dto.Amount;

            await _context.SaveChangesAsync();

            await _audit.LogAsync(new AuditLog
            {
                UserId = userId,
                Action = AuditActionEnum.UpdateGoal,
                EntityType = "GoalContribution",
                EntityId = goal.Id.ToString(),
                Metadata = JsonSerializer.Serialize(new
                {
                    AmountAdded = dto.Amount,
                    PreviousAmount = previousAmount,
                    NewAmount = goal.CurrentAmount
                })
            });

            _cacheInvalidatorService.InvalidateGoals(userId, goalId);
            _cacheInvalidatorService.InvalidateDashboard(userId, DateTime.UtcNow);

            return ToDto(goal);
        }

        private static GoalDto ToDto(Goal g) => new GoalDto
        {
            Id = g.Id,
            Name = g.Name,
            Description = g.Description,
            TargetAmount = g.TargetAmount,
            CurrentAmount = g.CurrentAmount,
            TargetDate = g.TargetDate,
            IsActive = g.IsActive,
            Icon = g.Icon
        };
    }
}
