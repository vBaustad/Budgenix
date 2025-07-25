using Budgenix.Models.BankStatements;

namespace Budgenix.Models.Learning;

public class TransactionCorrection
{
    public int Id { get; set; }
    public string MatchText { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool? IsIncome { get; set; }
    public BankTransactionType? TransactionType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; }
}
