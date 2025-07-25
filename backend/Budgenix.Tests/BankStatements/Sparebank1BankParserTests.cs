using Budgenix.Dtos.BankStatements;
using Budgenix.Models.BankStatements;
using Budgenix.Models.Learning;
using Budgenix.Services.BankStatements.Banks;
using Budgenix.Services.Learning;
using Moq;
using Stripe;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;


namespace Budgenix.Tests.BankStatements
{
    public class Sparebank1BankParserTests
    {
        private readonly Mock<ITransactionCorrectionService> _correctionServiceMock;
        private readonly Sparebank1BankParser _parser;
        private const string TestUserId = "test-user-123";

        public Sparebank1BankParserTests()
        {
            _correctionServiceMock = new Mock<ITransactionCorrectionService>();
            _correctionServiceMock
                .Setup(service => service.MatchAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync((string userId, string desc) => null); // no corrections applied for now

            _parser = new Sparebank1BankParser(_correctionServiceMock.Object);
        }

        [Fact]
        public async Task ParseAsync_ParsesMultipleValidTransactions()
        {
            // Arrange
            var sampleText = @"
                *0607 31.03 Nok 400.00 Vipps*cut shave Kurs: 1.0000 0104 400,00 0104
                Varer 10.04 Meny Ing. Rybergs Drammen 1104 557,86 1104
                Fra: Vebjørn Baustad Betalt: 02.04.25 0204 2.000,00 0204
                Småsparing Småsparing 3 stk fast beløp 0404 15,00 0404";

            // Act
            var results = await _parser.ParseAsync(sampleText, TestUserId);

            // Assert
            Assert.Equal(4, results.Count);

            Assert.Collection(results,
                t =>
                {
                    Assert.Equal("*0607 31.03 Nok 400.00 Vipps*cut shave Kurs: 1.0000", t.Description);
                    Assert.Equal(new DateTime(2025, 4, 1), t.Date);
                    Assert.Equal(400.00m, t.Amount);
                    Assert.False(t.IsIncome);
                    Assert.Equal(BankTransactionType.CardPayment, t.TransactionType);
                },
                t =>
                {
                    Assert.Equal("Varer 10.04 Meny Ing. Rybergs Drammen", t.Description);
                    Assert.Equal(new DateTime(2025, 4, 11), t.Date);
                    Assert.Equal(557.86m, t.Amount);
                    Assert.False(t.IsIncome);
                    Assert.Equal(BankTransactionType.Purchase, t.TransactionType);
                },
                t =>
                {
                    Assert.Equal("Fra: Vebjørn Baustad Betalt: 02.04.25", t.Description);
                    Assert.Equal(new DateTime(2025, 4, 2), t.Date);
                    Assert.Equal(2000.00m, t.Amount);
                    Assert.True(t.IsIncome);
                    Assert.Equal(BankTransactionType.Income, t.TransactionType);
                },
                t =>
                {
                    Assert.Equal("Småsparing Småsparing 3 stk fast beløp", t.Description);
                    Assert.Equal(new DateTime(2025, 4, 4), t.Date);
                    Assert.Equal(15.00m, t.Amount);
                    Assert.False(t.IsIncome);
                    Assert.Equal(BankTransactionType.Savings, t.TransactionType);
                }
            );
        }
        

    }
}
