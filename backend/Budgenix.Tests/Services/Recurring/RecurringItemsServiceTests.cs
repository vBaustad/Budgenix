using Budgenix.Models.Categories;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;

namespace Budgenix.Tests.Services.Recurring
{
    public class RecurringItemServiceTests
    {
        private readonly RecurringItemService _service = new(null!);


        [Theory]
        [InlineData("Daily", "2025-05-01", "2025-05-06", RecurringItemType.Expense, true, true)]
        [InlineData("Weekly", "2025-05-01", "2025-05-06", RecurringItemType.Expense, true, false)]
        [InlineData("Weekly", "2025-05-06", "2025-05-13", RecurringItemType.Expense, true, true)]
        [InlineData("Daily", "2025-05-05", "2025-05-06", RecurringItemType.Expense, false, false)]
        [InlineData("Monthly", "2025-01-15", "2025-05-15", RecurringItemType.Expense, true, true)]
        [InlineData("Monthly", "2023-01-31", "2025-04-30", RecurringItemType.Expense, true, true)]
        [InlineData("Monthly", "2023-01-31", "2025-03-30", RecurringItemType.Expense, true, false)]
        [InlineData("Daily", "2025-05-01", "2025-05-06", RecurringItemType.Income, true, true)]
        [InlineData("Weekly", "2025-05-01", "2025-05-06", RecurringItemType.Income, true, false)]
        [InlineData("Weekly", "2025-05-06", "2025-05-13", RecurringItemType.Income, true, true)]
        [InlineData("Daily", "2025-05-05", "2025-05-06", RecurringItemType.Income, false, false)]
        [InlineData("Monthly", "2025-01-15", "2025-05-15", RecurringItemType.Income, true, true)]
        [InlineData("Monthly", "2023-01-31", "2025-04-30", RecurringItemType.Income, true, true)]
        [InlineData("Monthly", "2023-01-31", "2025-03-30", RecurringItemType.Income, true, false)]
        public void IsDueToday_VariousScenarios_ReturnsExpected(string frequencyStr, string startDateStr, string todayStr, RecurringItemType type, bool isActive, bool expected)
        {
            var frequency = Enum.Parse<RecurrenceTypeEnum>(frequencyStr);
            var startDate = DateTime.Parse(startDateStr);
            var today = DateTime.Parse(todayStr);

            var item = new RecurringItem
            {
                Name = "Test",
                StartDate = startDate,
                Frequency = frequency,
                Type = type,
                IsActive = isActive
            };

            var result = _service.IsDueToday(item, today);

            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("2025-05-31", 3)]
        [InlineData("2025-05-13", 2)]
        [InlineData("2025-05-15", 2)]
        [InlineData("2025-04-30", 3)]
        [InlineData("2025-03-29", 2)]
        public void GetDueItems_ReturnsExpectedCount(string todayStr, int expectedCount)
        {
            var today = DateTime.Parse(todayStr);

            var items = new List<RecurringItem>
            {
                new RecurringItem
                {
                    Name = "Inactive",
                    StartDate = today.AddDays(-10),
                    Frequency = RecurrenceTypeEnum.Daily,
                    IsActive = false,
                    Type = RecurringItemType.Expense
                },
                new RecurringItem
                {
                    Name = "Daily",
                    StartDate = today.AddDays(-5),
                    Frequency = RecurrenceTypeEnum.Daily,
                    IsActive = true,
                    Type = RecurringItemType.Expense
                },
                new RecurringItem
                {
                    Name = "Weekly",
                    StartDate = today.AddDays(-7),
                    Frequency = RecurrenceTypeEnum.Weekly,
                    IsActive = true,
                    Type = RecurringItemType.Expense
                },
                new RecurringItem
                {
                    Name = "Monthly",
                    StartDate = new DateTime(2023, 1, 31),
                    Frequency = RecurrenceTypeEnum.Monthly,
                    IsActive = true,
                    Type = RecurringItemType.Expense
                }
            };

            var result = _service.GetDueItems(items, today);

            Assert.Equal(expectedCount, result.Count);
        }

        [Fact]
        public void CreateExpenseFromRecurringItem_MapsFieldsCorrectly()
        {
            var categoryId = Guid.NewGuid();
            var recurring = new RecurringItem
            {
                Name = "Netflix",
                Description = "Monthly bill",
                Frequency = RecurrenceTypeEnum.Monthly,
                StartDate = DateTime.Today.AddMonths(-3),
                Type = RecurringItemType.Expense,
                IsActive = true,
                Amount = 15.99m,
                CategoryId = categoryId
            };

            var expense = _service.CreateExpenseFromRecurringItem(recurring);

            Assert.Equal("Netflix", expense.Name);
            Assert.Equal(15.99m, expense.Amount);
            Assert.Equal(DateTime.Today, expense.Date);
            Assert.Equal(categoryId, expense.CategoryId);
            Assert.Contains("Auto-generated", expense.Notes);
        }

        [Fact]
        public void CreateExpenseFromRecurringItem_ThrowsIfCategoryMissing()
        {
            var recurring = new RecurringItem
            {
                Name = "Netflix",
                Description = "Monthly bill",
                Frequency = RecurrenceTypeEnum.Monthly,
                StartDate = DateTime.Today.AddMonths(-3),
                Type = RecurringItemType.Expense,
                IsActive = true,
                Amount = 15.99m,
                CategoryId = null
            };

            var ex = Assert.Throws<InvalidOperationException>(() =>
                _service.CreateExpenseFromRecurringItem(recurring)
            );

            Assert.Equal("Recurring item must have a CategoryId.", ex.Message);
        }

        [Fact]
        public void CreateIncomeFromRecurringItem_MapsFieldsCorrectly()
        {
            var categoryId = Guid.NewGuid();
            var recurring = new RecurringItem
            {
                Name = "Salary",
                Description = "Paycheck",
                Frequency = RecurrenceTypeEnum.Monthly,
                StartDate = DateTime.Today.AddMonths(-12),
                Type = RecurringItemType.Income,
                IsActive = true,
                Amount = 3000m,
                CategoryId = categoryId
            };

            var income = _service.CreateIncomeFromRecurringItem(recurring);

            Assert.Equal("Salary", income.Name);
            Assert.Equal(3000m, income.Amount);
            Assert.Equal(DateTime.Today, income.Date);
            Assert.Equal(categoryId, income.CategoryId);
            Assert.Contains("Auto-generated", income.Notes);
        }

        [Fact]
        public void CreateIncomeFromRecurringItem_ThrowsIfCategoryMissing()
        {
            var recurring = new RecurringItem
            {
                Name = "Salary",
                Description = "Paycheck",
                Frequency = RecurrenceTypeEnum.Monthly,
                StartDate = DateTime.Today.AddMonths(-12),
                Type = RecurringItemType.Income,
                IsActive = true,
                Amount = 3000m,
                CategoryId = null
            };

            var ex = Assert.Throws<InvalidOperationException>(() =>
                _service.CreateIncomeFromRecurringItem(recurring)
            );

            Assert.Equal("Recurring item must have a CategoryId.", ex.Message);
        }
    }
}
