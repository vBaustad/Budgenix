using Budgenix.Models.Budgeting;
using Budgenix.Models.Transactions;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace Budgenix.Models.Users
{
    public class ApplicationUser : IdentityUser
    {

        //Custom fields
        public SubscriptionTypeEnum SubscriptionTier { get; set; }

        //Four household/group sharing (optional)
        public Guid? HouseholdId { get; set; }

        public virtual ICollection<Income> Incomes { get; set; } = new List<Income>();
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();

    }
}
