using Budgenix.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Budgenix.Data
{
    public class AppData
    {
        public ObservableCollection<Expense> Expenses { get; set; } = new();
        public List<Income> Incomes { get; set; } = new();
        public List<Category> Categories { get; set; } = new();
    }
}
