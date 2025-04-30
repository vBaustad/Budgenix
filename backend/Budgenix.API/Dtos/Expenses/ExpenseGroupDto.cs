using Budgenix.Models;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Expenses
{
    public class ExpenseGroupDto
    {
        [Required]
        public required string GroupName { get; set; }
        public decimal TotalAmount { get; set; }
        public List<ExpenseDto> Expenses { get; set; } = new();
    }
}
