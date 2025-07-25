using Budgenix.Dtos.Learning;
using Budgenix.Models.BankStatements;
using Budgenix.Models.Learning;

namespace Budgenix.Services.Learning
{
    public interface ITransactionCorrectionService
    {
        Task<TransactionCorrection?> MatchAsync(string userId, string description);
        Task SaveCorrectionAsync(string userId, string matchText, string category, bool? isIncome = null, BankTransactionType? type = null);       
        Task<bool> UpdateCorrectionAsync(string userId, UpdateTransactionCorrectionDto dto);
        Task<bool> DeleteCorrectionAsync(string userId, int id);

    }
}
