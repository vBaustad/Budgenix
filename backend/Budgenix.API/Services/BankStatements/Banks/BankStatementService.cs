using Budgenix.Dtos.BankStatements;
using Microsoft.Extensions.DependencyInjection;

namespace Budgenix.Services.BankStatements.Banks
{
    public class BankStatementService : IBankStatementService
    {
        private readonly IServiceProvider _serviceProvider;

        public BankStatementService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
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
    }
}
