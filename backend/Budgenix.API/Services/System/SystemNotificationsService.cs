using Budgenix.Data;
using Budgenix.Models.System;
using Budgenix.Services.System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Budgenix.Services.System
{
    public class SystemNotificationsService : ISystemNotificationsService
    {
        private readonly BudgenixDbContext _context;

        public SystemNotificationsService(BudgenixDbContext context)
        {
            _context = context;
        }

        public async Task<List<SystemNotification>> GetUnreadForUserAsync(string userId)
        {
            var seenIds = await _context.UserNotificationReads
                .Where(x => x.UserId == userId)
                .Select(x => x.NotificationId)
                .ToListAsync();

            return await _context.SystemNotifications
                .Where(n => n.IsActive && !seenIds.Contains(n.Id))
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(string userId, string notificationId)
        {
            var alreadyExists = await _context.UserNotificationReads
                .AnyAsync(x => x.UserId == userId && x.NotificationId == notificationId);

            if (!alreadyExists)
            {
                _context.UserNotificationReads.Add(new UserNotificationRead
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    NotificationId = notificationId,
                    ReadAt = DateTime.UtcNow
                });

                await _context.SaveChangesAsync();
            }
        }
    }

}
