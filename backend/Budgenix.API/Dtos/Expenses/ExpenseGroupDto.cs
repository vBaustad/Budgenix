using Budgenix.Models;

namespace Budgenix.Dtos.Expenses
{
    public class ExpenseGroupDto
    {
        public string GroupName { get; set; } = "";
        public decimal TotalAmount { get; set; }
        public List<ExpenseDto> Expenses { get; set; } = new();
    }
}
