using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Budgenix.Models
{
    public class Expense
    {
        public Guid Id { get; set; } // Unique identifier for the expense

        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Category Category { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceType RecurrenceFrequency { get; set; }
        public string Notes { get; set; }
    }

    public enum RecurrenceType
    {
        None,
        Daily,
        Weekly,
        Monthly,
        Yearly
    }
}
