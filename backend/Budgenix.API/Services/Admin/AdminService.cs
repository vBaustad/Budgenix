using Budgenix.Data;
using Budgenix.Dtos.Admin;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly BudgenixDbContext _context;

        public AdminService(BudgenixDbContext context)
        {
            _context = context;
        }

        public async Task<List<AdminUserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(user => new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    SignupDate = user.CreatedAt,
                    LastLogin = user.LastLogin,
                    SubscriptionTier = user.SubscriptionTier,


                })
                .ToListAsync();
        }

        public async Task<AdminUserDetailsDto> GetUserDetailsAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("User not found");

            var expenses = await _context.Expenses.CountAsync(e => e.UserId == id);
            var income = await _context.Incomes.CountAsync(i => i.UserId == id);
            var budgets = await _context.Budgets.CountAsync(b => b.UserId == id);
            var goals = await _context.Goals.CountAsync(g => g.UserId == id);

            return new AdminUserDetailsDto
            {
                Id = user.Id,
                Email = user.Email,
                SignupDate = user.CreatedAt,
                LastLogin = user.LastLogin,
                SubscriptionTier = user.SubscriptionTier,
                Stats = new UserStatsDto
                {
                    Expenses = expenses,
                    Income = income,
                    Budgets = budgets,
                    Goals = goals
                }
            };
        }

        public async Task<AdminDeleteResultDto> DeleteUserAsync(string id)
        {
            // Delete related data first
            var expenses = _context.Expenses.Where(e => e.UserId == id);
            var incomes = _context.Incomes.Where(i => i.UserId == id);
            var budgets = _context.Budgets.Where(b => b.UserId == id);
            var goals = _context.Goals.Where(g => g.UserId == id);
            _context.Expenses.RemoveRange(expenses);
            _context.Incomes.RemoveRange(incomes);
            _context.Budgets.RemoveRange(budgets);
            _context.Goals.RemoveRange(goals);

            var user = await _context.Users.FindAsync(id);
            if (user != null) _context.Users.Remove(user);

            var deletedCount = await _context.SaveChangesAsync();
            return new AdminDeleteResultDto { Success = true, DeletedItemsCount = deletedCount };
        }

        public async Task DeleteUserItemAsync(string id, string type, Guid itemId)
        {
            switch (type.ToLower())
            {
                case "expense":
                    var expense = await _context.Expenses.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (expense != null) _context.Expenses.Remove(expense);
                    break;
                case "income":
                    var income = await _context.Incomes.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (income != null) _context.Incomes.Remove(income);
                    break;
                case "budget":
                    var budget = await _context.Budgets.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (budget != null) _context.Budgets.Remove(budget);
                    break;
                case "goal":
                    var goal = await _context.Goals.FirstOrDefaultAsync(x => x.Id == itemId && x.UserId == id);
                    if (goal != null) _context.Goals.Remove(goal);
                    break;
            }

            await _context.SaveChangesAsync();
        }
    }

}
