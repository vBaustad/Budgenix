using Budgenix.Models.Finance;
using Budgenix.Models.Categories;
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
        public DbSet<RecurringItem> RecurringItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // === Entity relationships ===
            builder.Entity<Expense>()
                .HasOne(e => e.User)
                .WithMany(u => u.Expenses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Income>()
                .HasOne(i => i.User)
                .WithMany(u => u.Incomes)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Budget>()
                .HasOne(b => b.User)
                .WithMany(u => u.Budgets)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RecurringItem>()
                .HasOne(r => r.User)
                .WithMany(u => u.RecurringItems)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RecurringItem>()
                .Property(r => r.Type)
                .HasConversion<string>();

            // === Indexes ===
            builder.Entity<Expense>()
                .HasIndex(e => new { e.UserId, e.Date });

            builder.Entity<Income>()
                .HasIndex(i => new { i.UserId, i.Date });

            builder.Entity<RecurringItem>()
                .HasIndex(r => new { r.UserId, r.StartDate });
        }
    }
}
