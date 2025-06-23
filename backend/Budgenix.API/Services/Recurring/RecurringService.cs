using AutoMapper;
using Budgenix.Data;
using Budgenix.Dtos.Expenses;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Services.Recurring
{
    public class RecurringService : IRecurringService
    {
        private readonly BudgenixDbContext _context;
        private readonly RecurringItemService _ruleEngine;
        private readonly IMapper _mapper;

        public RecurringService(BudgenixDbContext context, RecurringItemService ruleEngine, IMapper mapper)
        {
            _context = context;
            _ruleEngine = ruleEngine;
            _mapper = mapper;
        }

        public async Task<List<RecurringItemDto>> GetAllAsync(string userId)
        {
            var today = DateTime.Today;
            var items = await _context.RecurringItems
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return items.Select(i => ToDto(i, today)).ToList();
        }

        public async Task<List<RecurringItemDto>> GetUpcomingAsync(string userId, int daysAhead)
        {
            var today = DateTime.Today;
            var endDate = today.AddDays(daysAhead);

            var items = await _context.RecurringItems
                .Where(x => x.UserId == userId && x.IsActive)
                .ToListAsync();

            return items
                .Select(i => ToDto(i, today))
                .Where(dto => dto.NextOccurrenceDate != null &&
                              dto.NextOccurrenceDate.Value >= today &&
                              dto.NextOccurrenceDate.Value <= endDate)
                .OrderBy(dto => dto.NextOccurrenceDate)
                .ToList();
        }

        public async Task<RecurringOverviewDto> GetOverviewAsync(string userId, int month, int year)
        {
            var today = DateTime.Today;
            var items = await _context.RecurringItems
                .Where(x => x.UserId == userId && x.IsActive)
                .ToListAsync();

            var itemDtos = items.Select(i => ToDto(i, today)).ToList();

            var upcomingExpenses = itemDtos
                .Where(d => d.Type == RecurringItemType.Expense &&
                            d.NextOccurrenceDate.HasValue &&
                            d.NextOccurrenceDate.Value.Year == year &&
                            d.NextOccurrenceDate.Value.Month == month)
                .ToList();

            var upcomingIncomes = itemDtos
                .Where(d => d.Type == RecurringItemType.Income &&
                            d.NextOccurrenceDate.HasValue &&
                            d.NextOccurrenceDate.Value.Year == year &&
                            d.NextOccurrenceDate.Value.Month == month)
                .ToList();

            var upcomingRecurringExpenseTotal = upcomingExpenses.Sum(x => x.Amount);
            var upcomingRecurringIncomeTotal = upcomingIncomes.Sum(x => x.Amount);

            return new RecurringOverviewDto
            {
                UpcomingRecurringExpenses = upcomingExpenses,
                UpcomingRecurringIncomes = upcomingIncomes,
                UpcomingRecurringExpenseTotal = upcomingRecurringExpenseTotal,
                UpcomingRecurringIncomeTotal = upcomingRecurringIncomeTotal,
                NextRecurringExpense = upcomingExpenses.OrderBy(d => d.NextOccurrenceDate).FirstOrDefault(),
                NextRecurringIncome = upcomingIncomes.OrderBy(d => d.NextOccurrenceDate).FirstOrDefault(),
                MonthlyRecurringExpenseTotal = upcomingExpenses.Sum(d => d.Amount),
                MonthlyRecurringIncomeTotal = upcomingIncomes.Sum(d => d.Amount),
                LastTriggeredRecurringExpense = itemDtos
                    .Where(d => d.Type == RecurringItemType.Expense && d.LastTriggeredDate != null)
                    .OrderByDescending(d => d.LastTriggeredDate)
                    .FirstOrDefault(),
                LastSkippedRecurringExpense = itemDtos
                    .Where(d => d.Type == RecurringItemType.Expense && d.LastSkippedDate != null)
                    .OrderByDescending(d => d.LastSkippedDate)
                    .FirstOrDefault(),
                LastTriggeredRecurringIncome = itemDtos
                    .Where(d => d.Type == RecurringItemType.Income && d.LastTriggeredDate != null)
                    .OrderByDescending(d => d.LastTriggeredDate)
                    .FirstOrDefault(),
                LastSkippedRecurringIncome = itemDtos
                    .Where(d => d.Type == RecurringItemType.Income && d.LastSkippedDate != null)
                    .OrderByDescending(d => d.LastSkippedDate)
                    .FirstOrDefault()
            };
        }

        public async Task<RecurringItemDto?> GetByIdAsync(string userId, Guid id)
        {
            var today = DateTime.Today;
            var item = await _context.RecurringItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            return item == null ? null : ToDto(item, today);
        }

        public async Task<RecurringItemDto> CreateAsync(string userId, CreateRecurringItemDto dto)
        {
            var entity = new RecurringItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = dto.Name,
                Description = dto.Description,
                Amount = dto.Amount,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Frequency = dto.Frequency,
                IsActive = dto.IsActive,
                Type = dto.Type,
                CategoryId = dto.CategoryId
            };

            _context.RecurringItems.Add(entity);
            await _context.SaveChangesAsync();

            return ToDto(entity, DateTime.Today);
        }

        public async Task<RecurringItemDto?> UpdateAsync(string userId, Guid id, UpdateRecurringItemDto dto)
        {
            var item = await _context.RecurringItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            if (item == null)
                return null;

            item.Name = dto.Name;
            item.Description = dto.Description;
            item.Amount = dto.Amount;
            item.StartDate = dto.StartDate;
            item.EndDate = dto.EndDate;
            item.Frequency = dto.Frequency;
            item.IsActive = dto.IsActive;
            item.Type = dto.Type;
            item.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();
            return ToDto(item, DateTime.Today);
        }

        public async Task<bool> DeleteAsync(string userId, Guid id)
        {
            var item = await _context.RecurringItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            if (item == null)
                return false;

            _context.RecurringItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ExpenseDto?> TriggerAsync(string userId, Guid id)
        {
            var item = await _context.RecurringItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            if (item == null)
                return null;

            var expense = _ruleEngine.CreateExpenseFromRecurringItem(item);
            expense.Id = Guid.NewGuid();
            expense.UserId = userId;

            item.LastTriggeredDate = DateTime.Today;
            item.IsFulfilledForCurrentPeriod = true;
            _ruleEngine.AdvanceStartDate(item);

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return _mapper.Map<ExpenseDto>(expense);
        }

        public async Task<bool> SkipAsync(string userId, Guid id, DateTime? occurrenceDate = null)
        {
            var item = await _context.RecurringItems
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == id);

            if (item == null)
                return false;

            item.LastSkippedDate = occurrenceDate ?? DateTime.Today;
            item.IsFulfilledForCurrentPeriod = false;
            _ruleEngine.AdvanceStartDate(item);

            await _context.SaveChangesAsync();
            return true;
        }

        private RecurringItemDto ToDto(RecurringItem item, DateTime today)
        {
            var nextDate = _ruleEngine.GetNextOccurrenceDate(item, today);

            return new RecurringItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                Amount = item.Amount,
                StartDate = item.StartDate,
                EndDate = item.EndDate,
                Frequency = item.Frequency,
                IsActive = item.IsActive,
                Type = item.Type,
                CategoryId = item.CategoryId,
                LastTriggeredDate = item.LastTriggeredDate,
                LastSkippedDate = item.LastSkippedDate,
                NextOccurrenceDate = nextDate,
                IsFulfilledForCurrentPeriod = item.IsFulfilledForCurrentPeriod
            };
        }
    }
}
