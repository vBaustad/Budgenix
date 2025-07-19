using Budgenix.Data;
using Budgenix.Dtos.Admin;
using Budgenix.Models.Users;
using Budgenix.Models.Audit;
using Budgenix.Services.Audit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Budgenix.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly BudgenixDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuditService _auditService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdminService(
            BudgenixDbContext context,
            UserManager<ApplicationUser> userManager,
            IAuditService auditService,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _userManager = userManager;
            _auditService = auditService;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<AdminUserDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
            var userDtos = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userDtos.Add(new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    SignupDate = user.CreatedAt,
                    LastLogin = user.LastLogin,
                    SubscriptionTier = user.SubscriptionTier,
                    Role = roles.FirstOrDefault() ?? "User",
                    IsActive = user.SubscriptionIsActive,
                    Country = user.Country,
                    EmailConfirmed = user.EmailConfirmed
                });
            }

            return userDtos;
        }


        public async Task<AdminUserDetailsDto> GetUserDetailsAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            var expenses = await _context.Expenses.CountAsync(e => e.UserId == id);
            var income = await _context.Incomes.CountAsync(i => i.UserId == id);
            var budgets = await _context.Budgets.CountAsync(b => b.UserId == id);
            var goals = await _context.Goals.CountAsync(g => g.UserId == id);
            var recentLogs = await GetRecentUserActivityAsync(id);

            return new AdminUserDetailsDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmailConfirmed = user.EmailConfirmed,
                SignupDate = user.CreatedAt,
                LastLogin = user.LastLogin,
                Country = user.Country,
                SubscriptionTier = user.SubscriptionTier,
                SubscriptionIsActive = user.SubscriptionIsActive,
                BillingCycle = user.BillingCycle,
                SubscriptionStartDate = user.SubscriptionStartDate,
                SubscriptionEndDate = user.SubscriptionEndDate,
                Currency = user.Currency,
                ReferralCode = user.ReferralCode,
                Role = roles.FirstOrDefault() ?? "User",
                Stats = new UserStatsDto
                {
                    Expenses = expenses,
                    Income = income,
                    Budgets = budgets,
                    Goals = goals
                },
                RecentActivity = recentLogs
            };
        }


        public async Task<List<AdminAuditLogDto>> GetRecentUserActivityAsync(string userId, int limit = 20)
        {
            return await _context.AuditLogs
                .Where(log => log.UserId == userId || log.TargetUserId == userId)
                .OrderByDescending(log => log.Timestamp)
                .Take(limit)
                .Select(log => new AdminAuditLogDto
                {
                    Id = log.Id.ToString(),
                    UserId = log.UserId,
                    Action = log.Action.ToString(),
                    EntityType = log.EntityType,
                    EntityId = log.EntityId,
                    TargetUserId = log.TargetUserId,
                    OldValues = log.OldValues,
                    NewValues = log.NewValues,
                    Metadata = log.Metadata,
                    IpAddress = log.IpAddress,
                    UserAgent = log.UserAgent,
                    Success = log.Success,
                    ErrorMessage = log.ErrorMessage,
                    Timestamp = log.Timestamp
                })
                .ToListAsync();
        }


        public async Task<AdminDeleteResultDto> DeleteUserAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("User not found");

            var oldUserData = JsonConvert.SerializeObject(user);

            _context.Expenses.RemoveRange(_context.Expenses.Where(e => e.UserId == id));
            _context.Incomes.RemoveRange(_context.Incomes.Where(i => i.UserId == id));
            _context.Budgets.RemoveRange(_context.Budgets.Where(b => b.UserId == id));
            _context.Goals.RemoveRange(_context.Goals.Where(g => g.UserId == id));

            _context.Users.Remove(user);
            var deletedCount = await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                userId: GetCurrentUserId(),
                action: AuditActionEnum.AdminDeleteUser,
                entityType: "User",
                entityId: id,
                targetUserId: id,
                oldValues: oldUserData,
                metadata: "Admin deleted user account and related data"
            );

            return new AdminDeleteResultDto { Success = true, DeletedItemsCount = deletedCount };
        }

        public async Task DeleteUserItemAsync(string id, string type, Guid itemId)
        {
            string? entityType = null;
            string? oldData = null;

            switch (type.ToLower())
            {
                case "expense":
                    var expense = await _context.Expenses.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (expense != null)
                    {
                        oldData = JsonConvert.SerializeObject(expense);
                        entityType = "Expense";
                        _context.Expenses.Remove(expense);
                    }
                    break;
                case "income":
                    var income = await _context.Incomes.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (income != null)
                    {
                        oldData = JsonConvert.SerializeObject(income);
                        entityType = "Income";
                        _context.Incomes.Remove(income);
                    }
                    break;
                case "budget":
                    var budget = await _context.Budgets.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (budget != null)
                    {
                        oldData = JsonConvert.SerializeObject(budget);
                        entityType = "Budget";
                        _context.Budgets.Remove(budget);
                    }
                    break;
                case "goal":
                    var goal = await _context.Goals.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (goal != null)
                    {
                        oldData = JsonConvert.SerializeObject(goal);
                        entityType = "Goal";
                        _context.Goals.Remove(goal);
                    }
                    break;
            }

            if (entityType != null)
            {
                await _context.SaveChangesAsync();

                await _auditService.LogAsync(
                    userId: GetCurrentUserId(),
                    action: AuditActionEnum.AdminDeleteUser,
                    entityType: entityType,
                    entityId: itemId.ToString(),
                    targetUserId: id,
                    oldValues: oldData,
                    metadata: $"Admin deleted {entityType} of user {id}"
                );
            }
        }

        private string GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value ?? "unknown";
        }
    }
}
