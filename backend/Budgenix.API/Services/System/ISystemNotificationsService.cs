using Budgenix.Models.System;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.Services.System
{
    public interface ISystemNotificationsService
    {
        Task<List<SystemNotification>> GetUnreadForUserAsync(string userId);
        Task MarkAsReadAsync(string userId, string notificationId);
    }

}
