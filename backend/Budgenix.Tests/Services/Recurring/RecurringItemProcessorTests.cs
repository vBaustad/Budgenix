using System;
using System.Collections.Generic;
using System.Linq;
using Budgenix.Data;
using Budgenix.Models.Finance;
using Budgenix.Models.Shared;
using Budgenix.Models.Users;
using Budgenix.Services;
using Budgenix.Services.Recurring;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Budgenix.Tests.Services.Recurring
{
    public class RecurringItemProcessorTests
    {
        private BudgenixDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<BudgenixDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;

            return new BudgenixDbContext(options);
        }

        public class FakeUserService : IUserService
        {
            private readonly string _userId;

            public FakeUserService(string userId)
            {
                _userId = userId;
            }

            public string? GetUserId() => _userId;

            // Stub for GetUserEmail (return null or fake)
            public string? GetUserEmail() => "fakeuser@example.com";
        }

        [Fact]
        public void ProcessDueItems_CreateExpense_WhenRecurringItemIsDue()
        {
            // Arrange
            var dbContext = CreateInMemoryDbContext();
            var userId = Guid.NewGuid().ToString();

            // Seed a test user
            var user = new ApplicationUser { Id = userId, UserName = "testuser" };
            dbContext.Users.Add(user);

            // Add a due recurring item (e.g., daily so it's always due)
            var recurringItem = new RecurringItem
            {
                Name = "Test Rent",
                Description = "Monthly Rent",
                Type = "Expense",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-2),
                Frequency = RecurrenceTypeEnum.Daily,
                Amount = 1000m,
                CategoryId = Guid.NewGuid(),
                UserId = userId,
            };

            dbContext.RecurringItems.Add(recurringItem);

            dbContext.SaveChanges();

            // Create real service + processor (you may need to pass a fake/mock IUserService)
            var service = new RecurringItemService();
            var fakeUserService = new FakeUserService(userId);
            var processor = new RecurringItemProcessor(fakeUserService, dbContext, service);

            //Act
            processor.ProcessDueItems(DateTime.Today);

            //Assert
            var expenses = dbContext.Expenses.ToList();
            Assert.Single(expenses);
            Assert.Equal(recurringItem.Name, expenses[0].Name);
            Assert.Equal(userId, expenses[0].UserId);
        }

        [Fact]
        public void ProcessDueItems_CreateExpenseAndIncome_WhenBothAreDue()
        {
            //arrange 
            var dbContext = CreateInMemoryDbContext();
            var userId = Guid.NewGuid().ToString();

            //Seed a test user 
            var user = new ApplicationUser { Id = userId, UserName = "testuser" };
            dbContext.Users.Add(user);

            // Add a due Expense recurring item (Daily)
            var expenseRecurring = new RecurringItem
            {
                Name = "Gym Membership",
                Description = "Monthly gym fee",
                Type = "Expense",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-2),
                Frequency = RecurrenceTypeEnum.Daily,
                Amount = 50m,
                CategoryId = Guid.NewGuid(),
                UserId = userId
            };

            // Add a due Income recurring item (Daily)
            var incomeRecurring = new RecurringItem
            {
                Name = "Salary",
                Description = "Monthly salary",
                Type = "Income",
                IsActive = true,
                StartDate = DateTime.Today.AddMonths(-6),
                Frequency = RecurrenceTypeEnum.Daily,
                Amount = 3000m,
                CategoryId = Guid.NewGuid(),
                UserId = userId
            };

            dbContext.RecurringItems.AddRange(expenseRecurring,  incomeRecurring);

            dbContext.SaveChanges();

            var service = new RecurringItemService();
            var fakeUserService = new FakeUserService(userId);
            var processor = new RecurringItemProcessor(fakeUserService, dbContext, service);

            //Act
            processor.ProcessDueItems(DateTime.Today);

            //Assert
            var expenses = dbContext.Expenses.ToList();
            var incomes = dbContext.Incomes.ToList();

            Assert.Single(expenses);
            Assert.Single(incomes); 

            Assert.Equal(expenseRecurring.Name, expenses[0].Name);
            Assert.Equal(incomeRecurring.Name, incomes[0].Name);
            Assert.Equal(userId, expenses[0].UserId);
            Assert.Equal(userId, incomes[0].UserId);

        }
    }
}
