using Budgenix.Models.BankStatements;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Learning
{

    public class UpdateTransactionCorrectionDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string MatchText { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        public bool? IsIncome { get; set; }
        public BankTransactionType? TransactionType { get; set; }
    }
}
