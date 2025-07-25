using Budgenix.Dtos.BankStatements;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.Services.BankStatements.Banks
{
    public interface IBankStatementService
    {
        Task<List<ParsedTransactionDto>> ParseAsync(string extractedText, string userId, string bank);
    }
}
