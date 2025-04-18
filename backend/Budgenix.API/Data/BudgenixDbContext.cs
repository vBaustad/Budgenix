﻿using Budgenix.Models;
using Microsoft.EntityFrameworkCore;

namespace Budgenix.Data
{
    public class BudgenixDbContext : DbContext
    {
        public BudgenixDbContext(DbContextOptions<BudgenixDbContext> options)
            : base(options)
        {
        }

        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Budget> Budgets { get; set; }
    }
}
