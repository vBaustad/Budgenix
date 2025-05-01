using Budgenix.Models.Categories;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Services.Recurring;

namespace Budgenix.Tests.Services.Recurring
{
    public class RecurringItemServiceTests
    {
        private readonly RecurringItemService _service = new();

        [Theory]
        [InlineData("Daily", "2025-05-01", "2025-05-06", "Expense", true, true)]   // Daily, active, always due
        [InlineData("Weekly", "2025-05-01", "2025-05-06", "Expense", true, false)] // Weekly, not matching day
        [InlineData("Weekly", "2025-05-06", "2025-05-13", "Expense", true, true)]  // Weekly, matching day
        [InlineData("Daily", "2025-05-05", "2025-05-06", "Expense", false, false)] // Inactive
        [InlineData("Monthly", "2025-01-15", "2025-05-15", "Expense", true, true)] // Monthly match
        [InlineData("Monthly", "2023-01-31", "2025-04-30", "Expense", true, true)] // Monthly, short month adjust
        [InlineData("Monthly", "2023-01-31", "2025-03-30", "Expense", true, false)] // Monthly not due
        [InlineData("Daily", "2025-05-01", "2025-05-06", "Income", true, true)]   // Daily, active, always due
        [InlineData("Weekly", "2025-05-01", "2025-05-06", "Income", true, false)] // Weekly, not matching day
        [InlineData("Weekly", "2025-05-06", "2025-05-13", "Income", true, true)]  // Weekly, matching day
        [InlineData("Daily", "2025-05-05", "2025-05-06", "Income", false, false)] // Inactive
        [InlineData("Monthly", "2025-01-15", "2025-05-15", "Income", true, true)] // Monthly match
        [InlineData("Monthly", "2023-01-31", "2025-04-30", "Income", true, true)] // Monthly, short month adjust
        [InlineData("Monthly", "2023-01-31", "2025-03-30", "Income", true, false)] // Monthly not due
        public void isDueToday_VariousScenarios_ReturnsExpected(string frequencyStr, string startDatestr, string todayStr, string type, bool isActive, bool expectedResult)
        {
            var frequency = Enum.Parse<RecurrenceTypeEnum>(frequencyStr);
            var startDate = DateTime.Parse(startDatestr);
            var todayDate = DateTime.Parse(todayStr);

            var item = new RecurringItem
            {
                Name = "Test Item",
                Description = "Generated for test",
                Type = type,
                IsActive = isActive,
                StartDate = startDate,
                Frequency = frequency,
            };

            var result = _service.IsDueToday(item, todayDate);

            Assert.Equal(expectedResult, result);
        }



        [Theory]
        [InlineData("2025-05-31", 3)]  // Daily + Weekly + Monthly (May has 31)
        [InlineData("2025-05-13", 2)]  // Daily + Weekly
        [InlineData("2025-05-15", 2)]  // Daily + Weekly
        [InlineData("2025-04-30", 3)]  // Daily + Weekly + Monthly (adjust to 30)
        [InlineData("2025-03-29", 2)]  // Daily + Weekly (March has 31, 29 != 31)
        public void GetDueItems_ReturnsExpectedCount(string todayDateStr, int expectedCount)
        {
            var todayDate = DateTime.Parse(todayDateStr);

            var items = new List<RecurringItem>
                {
                    new RecurringItem // 0 → inactive
                    {
                        Name = "Inactive",
                        Description = "Should never match",
                        Type = "Expense",
                        IsActive = false,
                        StartDate = DateTime.Parse(todayDateStr).AddDays(-10),
                        Frequency = RecurrenceTypeEnum.Daily
                    },
                    new RecurringItem // 1 → matches if Daily
                    {
                        Name = "Daily",
                        Description = "Matches any day",
                        Type = "Expense",
                        IsActive = true,
                        StartDate = DateTime.Parse(todayDateStr).AddDays(-5),
                        Frequency = RecurrenceTypeEnum.Daily
                    },
                    new RecurringItem // 2 → matches if same DayOfWeek
                    {
                        Name = "Weekly",
                        Description = "Matches same weekday",
                        Type = "Expense",
                        IsActive = true,
                        StartDate = DateTime.Parse(todayDateStr).AddDays(-7),
                        Frequency = RecurrenceTypeEnum.Weekly
                    },
                    new RecurringItem // 3 → matches only if same day-of-month or last-of-month
                    {
                        Name = "Monthly",
                        Description = "Matches day-of-month",
                        Type = "Expense",
                        IsActive = true,
                        StartDate = new DateTime(2023, 1, 31), // can trigger short-month fallback
                        Frequency = RecurrenceTypeEnum.Monthly
                    }
                };


            var result = _service.GetDueItems(items, todayDate);

            Assert.True(expectedCount == result.Count, $"Expected {expectedCount} matches on {todayDate:d}, but got {result.Count}");

        }

        [Fact]
        public void CreateExpenseFromRecurringItem_MapsFieldsCorrectly()
        {
            //Arrange 
            var categoryId = Guid.NewGuid();

            var recurring = new RecurringItem
            {
                Name = "Netflix Subscription",
                Description = "Monthly Netflix bill",
                Type = "Expense",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-3),
                Frequency = RecurrenceTypeEnum.Monthly,
                Amount = 15.99m,
                CategoryId = categoryId
            };            

            //Act
            var expense = _service.CreateExpenseFromRecurringItem(recurring);

            // Assert
            Assert.Equal(recurring.Name, expense.Name);
            Assert.Equal(recurring.Description, expense.Description);
            Assert.Equal(recurring.Amount, expense.Amount);
            Assert.Equal(DateTime.Today, expense.Date);
            Assert.Equal(categoryId, expense.CategoryId);
            Assert.True(expense.IsRecurring);
            Assert.Equal(recurring.Frequency, expense.RecurrenceFrequency);
            Assert.Contains("Auto-generated from recurring item", expense.Notes);
        }

        [Fact]
        public void CreateExpenseFromRecurringItem_ThrowsIfCategoryIdIsNull()
        {            

            var recurring = new RecurringItem
            {
                Name = "Netflix Subscription",
                Description = "Monthly Netflix bill",
                Type = "Expense",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-3),
                Frequency = RecurrenceTypeEnum.Monthly,
                Amount = 15.99m,
                CategoryId = null //Missing category ID
            };

            // Act & Assert
            var exception = Assert.Throws<InvalidOperationException>(() =>
                _service.CreateExpenseFromRecurringItem(recurring)
            );

            Assert.Equal("Recurring item must have a CategoryId.", exception.Message);
        }

        [Fact]
        public void CreateIncomeFromRecurringItem_MapsFieldsCorrectly()
        {
            // Arrange
            var categoryId = Guid.NewGuid();

            var recurring = new RecurringItem
            {
                Name = "Salary",
                Description = "Monthly paycheck",
                Type = "Income",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-12),
                Frequency = RecurrenceTypeEnum.Monthly,
                Amount = 3000m,
                CategoryId = categoryId
            };

            // Act
            var income = _service.CreateIncomeFromRecurringItem(recurring);

            // Assert
            Assert.Equal(recurring.Name, income.Name);
            Assert.Equal(recurring.Description, income.Description);
            Assert.Equal(recurring.Amount, income.Amount);
            Assert.Equal(DateTime.Today, income.Date);
            Assert.Equal(categoryId, income.CategoryId);
            Assert.True(income.IsRecurring);
            Assert.Equal(recurring.Frequency, income.RecurrenceFrequency);
            Assert.Contains("Auto-generated from recurring item", income.Notes);
        }

        [Fact]
        public void CreateIncomeFromRecurringItem_ThrowsIfCategoryIdIsNull()
        {

            var recurring = new RecurringItem
            {
                Name = "Salary",
                Description = "Monthly paycheck",
                Type = "Income",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-12),
                Frequency = RecurrenceTypeEnum.Monthly,
                Amount = 3000m,
                CategoryId = null
            };

            // Act & Assert
            var exception = Assert.Throws<InvalidOperationException>(() =>
                _service.CreateIncomeFromRecurringItem(recurring)
            );

            Assert.Equal("Recurring item must have a CategoryId.", exception.Message);
        }
    }
}