using Budgenix.Data;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.VisualBasic;
using System;

namespace Budgenix.Services.Recurring
{
    public class RecurringItemService
    {      

        public bool IsDueToday(RecurringItem recurringItem, DateTime todayDate) 
        {
            if(!recurringItem.IsActive)
                return false;

            if (recurringItem.StartDate >= todayDate)
                return false;                                
                
            if (recurringItem.EndDate != null && recurringItem.EndDate < todayDate)
                return false;

            switch(recurringItem.Frequency)
            {
                case RecurrenceTypeEnum.Daily: return true;

                case RecurrenceTypeEnum.Weekly:
                    return recurringItem.StartDate.DayOfWeek == todayDate.DayOfWeek;

                case RecurrenceTypeEnum.Monthly:
                    var startDay = recurringItem.StartDate.Day;
                    var daysInMonth = DateTime.DaysInMonth(todayDate.Year, todayDate.Month);
                    var dueDay = Math.Min(startDay, daysInMonth);
                    return todayDate.Day == dueDay;


                default: return false;
            };            
        }

        public Expense CreateExpenseFromRecurringItem(RecurringItem recurringItem)
        {
            return new Expense
            {
                Name = recurringItem.Name,
                Description = recurringItem.Description,
                Amount = recurringItem.Amount,
                Date = DateTime.Today,
                CategoryId = recurringItem.CategoryId ?? Guid.Empty,
                IsRecurring = true,
                RecurrenceFrequency = recurringItem.Frequency,
                Notes = $"Auto-generated from recurring item: {recurringItem.Name}",
            };
        }

        public Income CreateIncomeFromRecurringItem(RecurringItem recurringItem)
        {
            return new Income
            {
                Name = recurringItem.Name,
                Description = recurringItem.Description,
                Amount = recurringItem.Amount,
                Date = DateTime.Today,
                CategoryId = recurringItem.CategoryId ?? Guid.Empty,
                IsRecurring = true,
                RecurrenceFrequency = recurringItem.Frequency,
                Notes = $"Auto-generated from recurring item: {recurringItem.Name}",
            };
        }

        public List<RecurringItem> GetDueItems(List<RecurringItem> allItems, DateTime todayDate)
        {
            return allItems.Where(item => IsDueToday(item, todayDate)).ToList();
        }

        public List<RecurringItem> GetExpiringItems(List<RecurringItem> allItems, DateTime todayDate, int daysAhead = 7)
        {
            return allItems.Where(item => item.IsActive &&
            item.StartDate <= todayDate &&
            item.EndDate != null &&
            item.EndDate > todayDate &&
            item.EndDate < todayDate.AddDays(daysAhead)).ToList();
        }


        public List<RecurringItem> GetRecentlyEndedItems(List<RecurringItem> allItems, DateTime todayDate, int daysPast = 1)
        {
            var cutoff = todayDate.AddDays(-daysPast);

            return allItems.Where(item => 
            !item.IsActive &&
            item.StartDate <= todayDate &&
            item.EndDate != null &&
            item.EndDate.Value.Date >= cutoff.Date &&
            item.EndDate.Value.Date < todayDate.Date).ToList();
        }


        public List<RecurringItem> GetItemsDueNextDays(List<RecurringItem> allItems, DateTime todayDate, int daysAhead = 7)
        {
            var range = Enumerable.Range(0, daysAhead + 1)
                .Select(offset => todayDate.AddDays(offset))
                .ToList();

            return allItems.Where(item => item.IsActive && range.Any(day => IsDueToday(item, day))).ToList();
        }
    }
}
