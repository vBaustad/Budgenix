using System.ComponentModel.DataAnnotations;
using Budgenix.Models;
using Budgenix.Models.Shared;

namespace Budgenix.Dtos.Expenses
{
    public class CreateExpenseDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can't be longer than 100 characters")]
        public required string Name { get; set; }
        
        [StringLength(250, ErrorMessage = "Description can't be longer than 250 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        public Guid CategoryId { get; set; }

        [StringLength(500, ErrorMessage = "Notes can't be longer than 500 characters")]
        public string? Notes { get; set; }
    }
}
