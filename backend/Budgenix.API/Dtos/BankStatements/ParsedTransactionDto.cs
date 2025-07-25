using Budgenix.Models.BankStatements;

namespace Budgenix.Dtos.BankStatements
{
    public class ParsedTransactionDto
    {
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public bool IsIncome { get; set; }
        public BankTransactionType TransactionType { get; set; } = BankTransactionType.Unknown;
        public string? Category { get; set; }
        public bool? IsInternalTransfer {  get; set; }
    }


}
