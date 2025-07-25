using Budgenix.Dtos.BankStatements;

namespace Budgenix.Services.BankStatements.Banks
{
    public interface IBankStatementParser
    {
        Task<List<ParsedTransactionDto>> ParseAsync(string extractedText, string userId);
    }
}
