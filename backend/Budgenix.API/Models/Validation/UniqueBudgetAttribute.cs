using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Budgenix.Services;
using Budgenix.Models;
using Budgenix.Data;
using Microsoft.AspNetCore.Components.Forms;

public class UniqueBudgetAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if(value is not Budget budget)
            return new ValidationResult("Invalid budget object");

        var dbContext = validationContext.GetService(typeof(BudgenixDbContext)) as BudgenixDbContext;

        if (dbContext == null)
            return new ValidationResult("Database context not found");

        bool exists = dbContext.Budgets
            .AsNoTracking()
            .Any(b =>
                string.Equals(b.Category, budget.Category, StringComparison.OrdinalIgnoreCase) &&
                b.Month == budget.Month &&
                b.Year == budget.Year &&
                b.Id != budget.Id); //Ignore self on updates

        return exists ? new ValidationResult("A budget for this category and date already exists.") : ValidationResult.Success;
    }
}