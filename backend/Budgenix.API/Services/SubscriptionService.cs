using Budgenix.Data;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services
{
    public class SubscriptionService
    {
        private readonly BudgenixDbContext _context;

        public SubscriptionService(BudgenixDbContext context)
        {
            _context = context;
        }

        public async Task DeactivateExpiredGracePeriodUsersAsync()
        {
            var expiredUsers = await _context.Users
                .Where(u => u.SubscriptionIsActive
                         && u.SubscriptionGracePeriodEnd != null
                         && u.SubscriptionGracePeriodEnd < DateTime.UtcNow)
                .ToListAsync();

            foreach (var user in expiredUsers)
            {
                user.SubscriptionIsActive = false;
                user.SubscriptionEndDate = DateTime.UtcNow;
                user.SubscriptionGracePeriodEnd = null;

                Console.WriteLine($"Deactivated subscription for {user.Email}");
            }

            await _context.SaveChangesAsync();
        }
    }

}
