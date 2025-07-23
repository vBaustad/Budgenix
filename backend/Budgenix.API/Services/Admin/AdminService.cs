using Budgenix.Data;
using Budgenix.Dtos.Admin;
using Budgenix.Models.Users;
using Budgenix.Models.Audit;
using Budgenix.Services.Audit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Budgenix.Services.Email;
using System.Security.Claims;

namespace Budgenix.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly BudgenixDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuditService _auditService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;

        public AdminService(
            BudgenixDbContext context,
            UserManager<ApplicationUser> userManager,
            IAuditService auditService,
            IHttpContextAccessor httpContextAccessor,
            IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _auditService = auditService;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
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

            var manualOverrides = await GetManualSubscriptionOverridesAsync(user.Id);

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
                RecentActivity = recentLogs,
               
                ManualOverrides = manualOverrides
            };
        }


        public async Task<bool> GrantManualSubscriptionAsync(GrantSubscriptionOverrideDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                throw new Exception("User not found");

            var now = DateTime.UtcNow;
            var adminId = GetCurrentUserId();

            // Save override entry
            var overrideEntry = new ManualSubscriptionOverride
            {
                UserId = user.Id,
                Tier = dto.Tier,
                StartDate = now,
                EndDate = dto.EndDate,
                CustomMessage = dto.CustomMessage,
                SentEmail = dto.SendEmail,
                CreatedByAdminId = adminId,
                CreatedAt = now
            };

            _context.ManualSubscriptionOverrides.Add(overrideEntry);

            // Update user subscription fields
            user.SubscriptionTier = dto.Tier;
            user.SubscriptionIsActive = true;
            user.SubscriptionStartDate = now;
            user.SubscriptionEndDate = dto.EndDate;
            user.SubscriptionGracePeriodEnd = null;
            user.IsTrial = false;
            user.TrialEndDate = null;
            user.DiscountPercent = null;
            user.DiscountEndDate = null;

            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                userId: adminId,
                action: AuditActionEnum.AdminGrantManualSubscription,
                entityType: nameof(ManualSubscriptionOverride),
                entityId: overrideEntry.Id.ToString(),
                targetUserId: user.Id,
                newValues: JsonConvert.SerializeObject(overrideEntry),
                metadata: "Admin granted manual subscription override"
            );

            if (dto.SendEmail)
            {
                await _emailService.SendSubscriptionGrantedEmailAsync(
                    toEmail: user.Email,
                    firstName: user.FirstName,
                    tier: dto.Tier,
                    endDate: dto.EndDate
                );
            }

            return true;
        }


        public async Task<List<ManualSubscriptionOverrideDto>> GetManualSubscriptionOverridesAsync(string userId)
        {
            return await _context.ManualSubscriptionOverrides
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new ManualSubscriptionOverrideDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    Tier = o.Tier,
                    StartDate = o.StartDate,
                    EndDate = o.EndDate,
                    CustomMessage = o.CustomMessage,
                    SentEmail = o.SentEmail,
                    CreatedByAdminId = o.CreatedByAdminId,
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync();
        }


        public async Task<bool> RevokeManualSubscriptionAsync(Guid overrideId,string userId, string? reason = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");


            var overrideEntry = await _context.ManualSubscriptionOverrides.FindAsync(overrideId);
            if (overrideEntry == null)
                throw new Exception("Override not found");

            if (overrideEntry.UserId != user.Id)
                throw new Exception("Override does not belong to the specified user.");


            _context.ManualSubscriptionOverrides.Remove(overrideEntry);
            await _context.SaveChangesAsync();

            await _auditService.LogAsync(
                userId: GetCurrentUserId(),
                action: AuditActionEnum.AdminRevokeManualSubscription,
                entityType: nameof(ManualSubscriptionOverride),
                entityId: overrideEntry.Id.ToString(),
                targetUserId: overrideEntry.UserId,
                oldValues: JsonConvert.SerializeObject(overrideEntry),
                metadata: $"Revoked by {GetCurrentUserId()}: {reason ?? "No message"}"

            );

            await _emailService.SendSubscriptionRevokedEmailAsync(
                toEmail: user.Email,
                firstName: user.FirstName,
                tier: overrideEntry.Tier,
                endDate: overrideEntry.EndDate
            );


            return true;
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
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown";
        }

    }
}
