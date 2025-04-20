using Budgenix.Models;

namespace Budgenix.Dtos.Incomes
{
    public class IncomeGroupDto
    {
        public string GroupKey { get; set; } = "";
        public decimal Total { get; set; }
        public List<Income> Items { get; set; } = new();
    }
}
