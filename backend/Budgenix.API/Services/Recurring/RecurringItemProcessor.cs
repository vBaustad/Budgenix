using Budgenix.Data;
using Budgenix.Models.Shared;

namespace Budgenix.Services.Recurring
{
    public class RecurringItemProcessor
    {
        private readonly BudgenixDbContext _context;
        private readonly RecurringItemService _service;
        private readonly IUserService _userService;

        public RecurringItemProcessor(IUserService userService, BudgenixDbContext context, RecurringItemService service)
        {
            _context = context;
            _service = service;
            _userService = userService;
        }

        public void ProcessDueItems(DateTime today)
        {
            var userId = _userService.GetUserId();
            if (userId == null)
                return;

            var allRecurringItems = _context.RecurringItems
                .Where(r => r.IsActive && r.UserId == userId)
                .ToList();

            var dueItems = _service.GetDueItems(allRecurringItems, today);

            foreach (var item in dueItems)
            {
                switch (item.Type)
                {
                    case RecurringItemType.Expense:
                        var expense = _service.CreateExpenseFromRecurringItem(item);
                        expense.UserId = userId;
                        _context.Expenses.Add(expense);
                        break;

                    case RecurringItemType.Income:
                        var income = _service.CreateIncomeFromRecurringItem(item);
                        income.UserId = userId;
                        _context.Incomes.Add(income);
                        break;
                }
            }

            _context.SaveChanges();
        }
    }
}
