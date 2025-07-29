using Budgenix.Models.BankStatements;

namespace Budgenix.Helpers.BankStatements
{
    public class TransactionAnalysis
    {
        public string? Category { get; set; }
        public BankTransactionType Type { get; set; }
        public bool IsIncome { get; set; }
        public bool IsInternalTransfer { get; set; }
    }
}
