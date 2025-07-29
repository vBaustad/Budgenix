using Budgenix.Data;
using Budgenix.Dtos.BankStatements;
using Budgenix.Dtos.Expenses;
using Budgenix.Dtos.Incomes;
using Budgenix.Models.Categories;
using Budgenix.Models.Finance;
using Budgenix.Services.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Budgenix.Services.BankStatements.Banks
{
    public class BankStatementService : IBankStatementService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly BudgenixDbContext _context;
        private readonly ILogger<BankStatementService> _logger;
        private readonly IExpenseService _expenseService;
        private readonly IIncomeService _incomeService;
        private readonly Dictionary<(string type, CategoryTypeEnum catType), Guid> _fallbackCache = new();

        public BankStatementService(IServiceProvider serviceProvider, BudgenixDbContext context, IExpenseService expenseService, IIncomeService incomeService, ILogger<BankStatementService> logger)
        {
            _serviceProvider = serviceProvider;
            _context = context;
            _expenseService = expenseService;
            _incomeService = incomeService;
            _logger = logger;

        }

        public async Task<List<ParsedTransactionDto>> ParseAsync(string extractedText, string userId, string bank)
        {
            IBankStatementParser parser = bank.ToLowerInvariant() switch
            {
                "sparebank1" => _serviceProvider.GetRequiredService<Sparebank1BankParser>(),
                _ => throw new NotSupportedException($"Bank '{bank}' is not supported.")
            };

            return await parser.ParseAsync(extractedText, userId);
        }
        public async Task<ImportSummaryDto> ImportParsedTransactionsAsync(List<ParsedTransactionDto> transactions, string userId)
        {
            int importedIncome = 0;
            int importedExpense = 0;
            int skipped = 0;
            int aiNamesGenerated = 0;
            var warnings = new List<string>();

            foreach (var tx in transactions)
            {
                if (tx.Amount <= 0 || tx.Date == default)
                {
                    _logger.LogDebug("Skipped transaction with invalid amount or date: {Tx}", tx);
                    skipped++;
                    continue;
                }

                var categoryId = await ResolveCategoryIdAsync(tx.Category, tx.IsIncome == true);

                if (tx.IsIncome == true)
                {
                    var incomeDto = new CreateIncomeDto
                    {
                        Name = "[auto] Imported transaction",
                        Description = tx.Description ?? "(no description)",
                        Amount = tx.Amount,
                        Date = tx.Date,
                        CategoryId = categoryId,
                        IsInternalTransfer = tx.IsInternalTransfer ?? false,
                        Notes = "Imported from bank statement"
                    };

                    var result = await _incomeService.AddIncomeAsync(userId, incomeDto);
                    if (result != null && result.Name != "[auto] Imported transaction")
                        aiNamesGenerated++;

                    importedIncome++;
                }
                else
                {
                    var expenseDto = new CreateExpenseDto
                    {
                        Name = "[auto] Imported transaction",
                        Description = tx.Description ?? "(no description)",
                        Amount = tx.Amount,
                        Date = tx.Date,
                        CategoryId = categoryId,
                        IsInternalTransfer = tx.IsInternalTransfer ?? false,
                        Notes = "Imported from bank statement"
                    };

                    var result = await _expenseService.AddExpenseAsync(userId, expenseDto);
                    if (result != null && result.Name != "[auto] Imported transaction")
                        aiNamesGenerated++;

                    importedExpense++;
                }
            }

            _logger.LogInformation(
                "Successfully imported {IncomeCount} incomes, {ExpenseCount} expenses, {AiGenerated} with AI names for user {UserId}.",
                importedIncome, importedExpense, aiNamesGenerated, userId);

            return new ImportSummaryDto
            {
                TotalReceived = transactions.Count,
                ImportedIncomes = importedIncome,
                ImportedExpenses = importedExpense,
                Skipped = skipped,
                AiNamesGenerated = aiNamesGenerated,
                Warnings = warnings
            };
        }


        private async Task<Guid> ResolveCategoryIdAsync(string? categoryName, bool isIncome)
        {
            var type = isIncome ? CategoryTypeEnum.Income : CategoryTypeEnum.Expense;
            var fallbackName = "Miscellaneous";

            var normalized = categoryName?.Trim().ToLower();

            if (!string.IsNullOrEmpty(normalized))
            {
                var match = await _context.Categories
                    .Where(c => c.Name.ToLower() == normalized && c.Type == type)
                    .Select(c => new { c.Id })
                    .FirstOrDefaultAsync();

                if (match != null)
                    return match.Id;
            }
            else
            {
                _logger.LogDebug("Transaction category is missing or empty. Falling back to '{Fallback}' for type {Type}.", fallbackName, type);
            }

            // Cache fallback lookup
            var cacheKey = (fallbackName, type);
            if (_fallbackCache.TryGetValue(cacheKey, out var cachedId))
                return cachedId;

            var fallback = await _context.Categories
                .Where(c => c.Name == fallbackName)
                .Select(c => new { c.Id })
                .FirstOrDefaultAsync();

            if (fallback == null)
                throw new InvalidOperationException($"Fallback category '{fallbackName}' not found.");

            _logger.LogWarning("Could not resolve category '{CategoryName}', defaulting to '{Fallback}'.",
                categoryName, type, fallbackName);

            _fallbackCache[cacheKey] = fallback.Id;
            return fallback.Id;
        }
    }
}
