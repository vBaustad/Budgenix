using Budgenix.Dtos.Incomes;
using Budgenix.Models.Transactions;

namespace Budgenix.Helpers.Query
{
    public static class IncomeQueryHelper
    {
        public static IQueryable<Income> ApplyFilters(IQueryable<Income> incomes, DateTime? from, DateTime? to, string? category)
        {
            // Filter: date range
            if (from.HasValue)
                incomes = incomes.Where(i => i.Date >= from.Value);

            if (to.HasValue)
                incomes = incomes.Where(i => i.Date <= to.Value);

            // Filter: category
            if (!string.IsNullOrWhiteSpace(category))
                incomes = incomes.Where(i => string.Equals(i.Category.Name, category, StringComparison.OrdinalIgnoreCase));

            return incomes;
        }

        public static IQueryable<Income> ApplySorting(IQueryable<Income> incomes, string sort)
        {
            // Sort  
            return incomes = sort.ToLower() switch
            {
                "date_asc" => incomes.OrderBy(i => i.Date),
                "date_desc" => incomes.OrderByDescending(i => i.Date),
                "amount_asc" => incomes.OrderBy(i => i.Amount),
                "amount_desc" => incomes.OrderByDescending(i => i.Amount),
                "name_asc" => incomes.OrderBy(i => i.Name),
                "name_desc" => incomes.OrderByDescending(i => i.Name),
                _ => incomes.OrderByDescending(i => i.Date),
            };
        }

        public static IEnumerable<IncomeGroupDto> ApplyGrouping(IEnumerable<Income> incomes, string groupBy)
        {
            return groupBy.ToLower() switch
            {
                "month" => incomes
                .GroupBy(i => $"{i.Date:yyyy-MM}")
                .Select(g => new IncomeGroupDto
                {
                    GroupKey = g.Key,
                    Total = g.Sum(i => i.Amount),
                    Items = g.ToList()
                }),

                "year" => incomes
                .GroupBy(i => i.Date.Year.ToString())
                .Select(g => new IncomeGroupDto
                {
                    GroupKey = g.Key,
                    Total = g.Sum(i => i.Amount),
                    Items = g.ToList()
                }),

                "category" => incomes
                .GroupBy(i => i.Category?.Name ?? "Uncategorized")
                .Select(g => new IncomeGroupDto
                {
                    GroupKey = g.Key,
                    Total = g.Sum(i => i.Amount),
                    Items = g.ToList()
                }),

                _ => throw new InvalidOperationException("Should never reach here.")
            };
        }
    }
}
