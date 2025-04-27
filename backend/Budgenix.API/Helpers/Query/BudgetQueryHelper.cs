using AutoMapper;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;

namespace Budgenix.Helpers.Query
{
    public static class BudgetQueryHelper
    {
        public static IQueryable<Budget> ApplyFilters(IQueryable<Budget> budgets, string? category, BudgetTypeEnum? type)
        {
            // Filter: category
            if (!string.IsNullOrWhiteSpace(category))
                budgets = budgets.Where(b => string.Equals(b.Category.Name, category, StringComparison.OrdinalIgnoreCase));

            if (type != null)
                budgets = budgets.Where(b => b.Type == type.Value);

            return budgets;
        }


        public static IQueryable<Budget> ApplySorting(IQueryable<Budget> budgets, string sort)
        {
            // Sort  
            return sort.ToLower() switch
            {
                "start_date_asc" => budgets.OrderBy(b => b.StartDate),
                "start_date_desc" => budgets.OrderByDescending(b => b.StartDate),
                "end_date_asc" => budgets.OrderBy(b => b.EndDate),
                "end_date_desc" => budgets.OrderByDescending(b => b.EndDate),
                "allocatedamount_asc" => budgets.OrderBy(e => e.AllocatedAmount),
                "allocatedamount_desc" => budgets.OrderByDescending(i => i.AllocatedAmount),
                "name_asc" => budgets.OrderBy(e => e.Name),
                "name_desc" => budgets.OrderByDescending(e => e.Name),
                _ => budgets.OrderByDescending(e => e.StartDate),
            };
        }
    }
}
