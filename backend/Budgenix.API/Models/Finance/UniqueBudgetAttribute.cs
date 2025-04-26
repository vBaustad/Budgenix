using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Budgenix.Data;
using Budgenix.Models.Finance;

public class UniqueBudgetAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not Budget budget)
            return new ValidationResult("Invalid budget object");

        var dbContext = validationContext.GetService(typeof(BudgenixDbContext)) as BudgenixDbContext;

        if (dbContext == null)
            return new ValidationResult("Database context not found");

        // Check for another budget with the same CategoryId, overlapping date range, same User
        bool exists = dbContext.Budgets
            .AsNoTracking()
            .Any(b =>
                b.UserId == budget.UserId &&
                b.CategoryId == budget.CategoryId &&
                b.Id != budget.Id && // Ignore self
                (
                    // Overlapping date logic:
                    (!b.EndDate.HasValue || !budget.EndDate.HasValue) ||
                    (b.StartDate <= budget.EndDate && (b.EndDate ?? DateTime.MaxValue) >= budget.StartDate)
                )
            );

        return exists ? new ValidationResult("A budget for this category and date already exists.") : ValidationResult.Success;
    }
}