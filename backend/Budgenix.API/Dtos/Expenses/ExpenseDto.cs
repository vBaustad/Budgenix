using Budgenix.Models.Shared;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Expenses
{

    //Output
    public class ExpenseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsRecurring { get; set; }
        public RecurrenceTypeEnum RecurrenceFrequency { get; set; }
        public string? Notes { get; set; }
    }
}
