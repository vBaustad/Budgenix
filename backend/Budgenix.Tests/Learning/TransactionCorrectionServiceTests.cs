using Budgenix.Data;
using Budgenix.Dtos.Learning;
using Budgenix.Models.BankStatements;
using Budgenix.Models.Learning;
using Budgenix.Services.Learning;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Budgenix.Tests.Learning
{
    public class TransactionCorrectionServiceTests
    {
        [Fact]
        public async Task DeleteCorrection_RemovesMatchingEntry()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<BudgenixDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new BudgenixDbContext(options);
            var service = new TransactionCorrectionService(context);

            var userId = "test-user";
            var correction = new TransactionCorrection
            {
                UserId = userId,
                MatchText = "spotify",
                Category = "Subscriptions",
                CreatedAt = DateTime.UtcNow
            };

            context.TransactionCorrections.Add(correction);
            await context.SaveChangesAsync();

            // Act
            var result = await service.DeleteCorrectionAsync(userId, correction.Id);

            // Assert
            Assert.True(result);
            Assert.Empty(await context.TransactionCorrections.Where(x => x.UserId == userId).ToListAsync());
        }

        [Fact]
        public async Task UpdateCorrection_ChangesFieldsCorrectly()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<BudgenixDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            await using var context = new BudgenixDbContext(options);
            var service = new TransactionCorrectionService(context);

            var userId = "test-user";
            var original = new TransactionCorrection
            {
                UserId = userId,
                MatchText = "spotify",
                Category = "Subscriptions",
                IsIncome = null,
                TransactionType = BankTransactionType.Unknown,
                CreatedAt = DateTime.UtcNow
            };

            context.TransactionCorrections.Add(original);
            await context.SaveChangesAsync();

            var dto = new UpdateTransactionCorrectionDto
            {
                Id = original.Id,
                MatchText = "spotify premium",
                Category = "Entertainment",
                IsIncome = false,
                TransactionType = BankTransactionType.CardPayment
            };

            // Act
            var success = await service.UpdateCorrectionAsync(userId, dto);

            // Assert
            Assert.True(success);

            var updated = await context.TransactionCorrections.FindAsync(original.Id);
            Assert.NotNull(updated);
            Assert.Equal("spotify premium", updated!.MatchText);
            Assert.Equal("Entertainment", updated.Category);
            Assert.False(updated.IsIncome);
            Assert.Equal(BankTransactionType.CardPayment, updated.TransactionType);
        }


    }
}
