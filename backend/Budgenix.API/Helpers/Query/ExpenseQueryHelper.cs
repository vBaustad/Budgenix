﻿using AutoMapper;
using Budgenix.Dtos.Expenses;
using Budgenix.Models.Finance;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Budgenix.Helpers.Query
{
    public static class ExpenseQueryHelper
    {
        public static IQueryable<Expense> ApplyFilters(IQueryable<Expense> expenses, DateTime? from, DateTime? to, List<Guid> categoryGuids)
        {
              

            if (categoryGuids.Any())
                expenses = expenses.Where(e => categoryGuids.Contains(e.CategoryId));

            if (from != null)
                expenses = expenses.Where(e => e.Date >= from);

            if (to != null)
                expenses = expenses.Where(e => e.Date <= to);

            return expenses;
        }

        public static IQueryable<Expense> ApplySorting(IQueryable<Expense> expenses, string sort)
        {
            // Sort  
            return expenses = sort.ToLower() switch
            {
                "date_asc" => expenses.OrderBy(e => e.Date),
                "date_desc" => expenses.OrderByDescending(e => e.Date),
                "amount_asc" => expenses.OrderBy(e => e.Amount),
                "amount_desc" => expenses.OrderByDescending(i => i.Amount),
                "name_asc" => expenses.OrderBy(e => e.Name),
                "name_desc" => expenses.OrderByDescending(e => e.Name),
                _ => expenses.OrderByDescending(e => e.Date),
            };
        }

        public static IEnumerable<ExpenseGroupDto> ApplyGrouping(IEnumerable<Expense> expenses, string groupBy, IMapper mapper)
        {
            return groupBy.ToLower() switch
            {
                "month" => expenses
                .GroupBy(e => $"{e.Date:yyyy-MM}")
                .Select(g => new ExpenseGroupDto
                {
                    GroupName = g.Key,
                    TotalAmount = g.Sum(i => i.Amount),
                    Expenses = mapper.Map<List<ExpenseDto>>(g.ToList())
                }),

                "year" => expenses
                .GroupBy(e => e.Date.Year.ToString())
                .Select(g => new ExpenseGroupDto
                {
                    GroupName = g.Key,
                    TotalAmount = g.Sum(i => i.Amount),
                    Expenses = mapper.Map<List<ExpenseDto>>(g.ToList())
                }),

                "category" => expenses
                .GroupBy(e => e.Category?.Name ?? "Uncategorized")
                .Select(g => new ExpenseGroupDto
                {
                    GroupName = g.Key,
                    TotalAmount = g.Sum(e => e.Amount),
                    Expenses = mapper.Map<List<ExpenseDto>>(g.ToList())
                }),

                _ => throw new InvalidOperationException("Should never reach here.")
            };
        }
    }
}
