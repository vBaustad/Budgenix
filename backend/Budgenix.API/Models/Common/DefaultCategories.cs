namespace Budgenix.Models
{
    public static class DefaultCategories
    {
        public static List<Category> GetAll()
        {
            return new List<Category>
            {

                // EXPENSE CATEGORIES
                new Category { Name = "Rent", Type = CategoryType.Expense, ColorHex = "#F44336", IsUserDefined = false },
                new Category { Name = "Groceries", Type = CategoryType.Expense, ColorHex = "#FF9800", IsUserDefined = false },
                new Category { Name = "Utilities", Type = CategoryType.Expense, ColorHex = "#03A9F4", IsUserDefined = false },
                new Category { Name = "Transportation", Type = CategoryType.Expense, ColorHex = "#607D8B", IsUserDefined = false },
                new Category { Name = "Fuel", Type = CategoryType.Expense, ColorHex = "#795548", IsUserDefined = false },
                new Category { Name = "Dining Out", Type = CategoryType.Expense, ColorHex = "#FF7043", IsUserDefined = false },
                new Category { Name = "Entertainment", Type = CategoryType.Expense, ColorHex = "#9C27B0", IsUserDefined = false },
                new Category { Name = "Subscriptions", Type = CategoryType.Expense, ColorHex = "#7E57C2", IsUserDefined = false },
                new Category { Name = "Clothing", Type = CategoryType.Expense, ColorHex = "#8D6E63", IsUserDefined = false },
                new Category { Name = "Health", Type = CategoryType.Expense, ColorHex = "#E91E63", IsUserDefined = false },
                new Category { Name = "Insurance", Type = CategoryType.Expense, ColorHex = "#0097A7", IsUserDefined = false },
                new Category { Name = "Personal Care", Type = CategoryType.Expense, ColorHex = "#CE93D8", IsUserDefined = false },
                new Category { Name = "Education", Type = CategoryType.Expense, ColorHex = "#4DD0E1", IsUserDefined = false },
                new Category { Name = "Pets", Type = CategoryType.Expense, ColorHex = "#FFB300", IsUserDefined = false },
                new Category { Name = "Gifts & Donations", Type = CategoryType.Expense, ColorHex = "#D32F2F", IsUserDefined = false },
                new Category { Name = "Vacation", Type = CategoryType.Expense, ColorHex = "#FDD835", IsUserDefined = false },
                new Category { Name = "Household", Type = CategoryType.Expense, ColorHex = "#A1887F", IsUserDefined = false },
                new Category { Name = "Miscellaneous", Type = CategoryType.Expense, ColorHex = "#BDBDBD", IsUserDefined = false },


                // INCOME CATEGORIES
                new Category { Name = "Salary", Type = CategoryType.Income, ColorHex = "#4CAF50", IsUserDefined = false },
                new Category { Name = "Freelance", Type = CategoryType.Income, ColorHex = "#81C784", IsUserDefined = false },
                new Category { Name = "Business", Type = CategoryType.Income, ColorHex = "#388E3C", IsUserDefined = false },
                new Category { Name = "Investments", Type = CategoryType.Income, ColorHex = "#689F38", IsUserDefined = false },
                new Category { Name = "Dividends", Type = CategoryType.Income, ColorHex = "#33691E", IsUserDefined = false },
                new Category { Name = "Interest", Type = CategoryType.Income, ColorHex = "#558B2F", IsUserDefined = false },
                new Category { Name = "Rental Income", Type = CategoryType.Income, ColorHex = "#009688", IsUserDefined = false },
                new Category { Name = "Pension", Type = CategoryType.Income, ColorHex = "#43A047", IsUserDefined = false },
                new Category { Name = "Government Assistance", Type = CategoryType.Income, ColorHex = "#00ACC1", IsUserDefined = false },
                new Category { Name = "Gifts Received", Type = CategoryType.Income, ColorHex = "#66BB6A", IsUserDefined = false },
                new Category { Name = "Bonuses", Type = CategoryType.Income, ColorHex = "#8BC34A", IsUserDefined = false },


                // BOTH CATEGORIES
                new Category { Name = "Gifts", Type = CategoryType.Both, ColorHex = "#AB47BC", IsUserDefined = false },
                new Category { Name = "Reimbursements", Type = CategoryType.Both, ColorHex = "#FFCA28", IsUserDefined = false },

            };
        }
    }
}
