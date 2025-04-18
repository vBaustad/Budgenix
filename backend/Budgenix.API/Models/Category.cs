using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } // e.g., "Groceries", "Rent", "Salary"

        public CategoryType Type { get; set; }

        public string ColorHex { get; set; } // Optional: for UI badges/tags (e.g. "#FF9900")

        public string Notes { get; set; } // Optional description of the category
        public bool IsUserDefined { get; set; }

    }

    public enum CategoryType
    {
        Expense,
        Income,
        Both
    }
}
