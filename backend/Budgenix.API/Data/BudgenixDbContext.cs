using Budgenix.Models.Budgeting;
using Budgenix.Models.Categories;
using Budgenix.Models.Transactions;
using Budgenix.Models.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Data
{
    public class BudgenixDbContext : IdentityDbContext<ApplicationUser>
    {
        public BudgenixDbContext(DbContextOptions<BudgenixDbContext> options)
            : base(options)
        {
        }

        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Any custom entity configurations go here
        }
    }
}
