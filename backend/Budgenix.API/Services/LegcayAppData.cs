using Microsoft.EntityFrameworkCore;
using Budgenix.Models;

namespace Budgenix.Services
{
    public class AppData
    {
        public List<Expense> Expenses { get; set; } = new();
        public List<Income> Incomes { get; set; } = new();
        public List<Category> Categories { get; set; } = new();
    }
}
