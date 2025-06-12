using Budgenix.Models;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Incomes
{
    public class IncomeGroupDto
    {
        [Required]
        public required string GroupName { get; set; }
        public decimal TotalAmount { get; set; }
        public List<IncomeDto> Incomes { get; set; } = new();
    }
}
