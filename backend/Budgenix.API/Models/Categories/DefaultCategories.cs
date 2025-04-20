namespace Budgenix.Models.Categories
{
    public static class DefaultCategories
    {
        public static List<Category> GetAll()
        {
            return new List<Category>
            {

                // EXPENSE CATEGORIES
                new Category { Name = "Rent", Type = CategoryTypeEnum.Expense, ColorHex = "#F44336", IsUserDefined = false },
                new Category { Name = "Groceries", Type = CategoryTypeEnum.Expense, ColorHex = "#FF9800", IsUserDefined = false },
                new Category { Name = "Utilities", Type = CategoryTypeEnum.Expense, ColorHex = "#03A9F4", IsUserDefined = false },
                new Category { Name = "Transportation", Type = CategoryTypeEnum.Expense, ColorHex = "#607D8B", IsUserDefined = false },
                new Category { Name = "Fuel", Type = CategoryTypeEnum.Expense, ColorHex = "#795548", IsUserDefined = false },
                new Category { Name = "Dining Out", Type = CategoryTypeEnum.Expense, ColorHex = "#FF7043", IsUserDefined = false },
                new Category { Name = "Entertainment", Type = CategoryTypeEnum.Expense, ColorHex = "#9C27B0", IsUserDefined = false },
                new Category { Name = "Subscriptions", Type = CategoryTypeEnum.Expense, ColorHex = "#7E57C2", IsUserDefined = false },
                new Category { Name = "Clothing", Type = CategoryTypeEnum.Expense, ColorHex = "#8D6E63", IsUserDefined = false },
                new Category { Name = "Health", Type = CategoryTypeEnum.Expense, ColorHex = "#E91E63", IsUserDefined = false },
                new Category { Name = "Insurance", Type = CategoryTypeEnum.Expense, ColorHex = "#0097A7", IsUserDefined = false },
                new Category { Name = "Personal Care", Type = CategoryTypeEnum.Expense, ColorHex = "#CE93D8", IsUserDefined = false },
                new Category { Name = "Education", Type = CategoryTypeEnum.Expense, ColorHex = "#4DD0E1", IsUserDefined = false },
                new Category { Name = "Pets", Type = CategoryTypeEnum.Expense, ColorHex = "#FFB300", IsUserDefined = false },
                new Category { Name = "Gifts & Donations", Type = CategoryTypeEnum.Expense, ColorHex = "#D32F2F", IsUserDefined = false },
                new Category { Name = "Vacation", Type = CategoryTypeEnum.Expense, ColorHex = "#FDD835", IsUserDefined = false },
                new Category { Name = "Household", Type = CategoryTypeEnum.Expense, ColorHex = "#A1887F", IsUserDefined = false },
                new Category { Name = "Miscellaneous", Type = CategoryTypeEnum.Expense, ColorHex = "#BDBDBD", IsUserDefined = false },


                // INCOME CATEGORIES
                new Category { Name = "Salary", Type = CategoryTypeEnum.Income, ColorHex = "#4CAF50", IsUserDefined = false },
                new Category { Name = "Freelance", Type = CategoryTypeEnum.Income, ColorHex = "#81C784", IsUserDefined = false },
                new Category { Name = "Business", Type = CategoryTypeEnum.Income, ColorHex = "#388E3C", IsUserDefined = false },
                new Category { Name = "Investments", Type = CategoryTypeEnum.Income, ColorHex = "#689F38", IsUserDefined = false },
                new Category { Name = "Dividends", Type = CategoryTypeEnum.Income, ColorHex = "#33691E", IsUserDefined = false },
                new Category { Name = "Interest", Type = CategoryTypeEnum.Income, ColorHex = "#558B2F", IsUserDefined = false },
                new Category { Name = "Rental Income", Type = CategoryTypeEnum.Income, ColorHex = "#009688", IsUserDefined = false },
                new Category { Name = "Pension", Type = CategoryTypeEnum.Income, ColorHex = "#43A047", IsUserDefined = false },
                new Category { Name = "Government Assistance", Type = CategoryTypeEnum.Income, ColorHex = "#00ACC1", IsUserDefined = false },
                new Category { Name = "Gifts Received", Type = CategoryTypeEnum.Income, ColorHex = "#66BB6A", IsUserDefined = false },
                new Category { Name = "Bonuses", Type = CategoryTypeEnum.Income, ColorHex = "#8BC34A", IsUserDefined = false },


                // BOTH CATEGORIES
                new Category { Name = "Gifts", Type = CategoryTypeEnum.Both, ColorHex = "#AB47BC", IsUserDefined = false },
                new Category { Name = "Reimbursements", Type = CategoryTypeEnum.Both, ColorHex = "#FFCA28", IsUserDefined = false },

            };
        }
    }
}
