using Budgenix.API.Models.Users;
using Budgenix.Models.Finance;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models.Users
{
    public class ApplicationUser : IdentityUser
    {
        // Personal Info
        [Required]
        [MaxLength(100)]
        public required string FirstName { get; set; }  // Required: first name

        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; }   // Required: last name

        // Email is already inherited from IdentityUser and is required by default

        // Optional: Address fields (only if needed for billing/invoice)

        [MaxLength(200)]
        public string? AddressLine1 { get; set; }  // Optional

        [MaxLength(200)]
        public string? AddressLine2 { get; set; }  // Optional

        [MaxLength(100)]
        public string? City { get; set; }          // Optional

        [MaxLength(100)]
        public string? StateOrProvince { get; set; }  // Optional

        [MaxLength(20)]
        public string? ZipOrPostalCode { get; set; }  // Optional

        [MaxLength(100)]
        public string? Country { get; set; }          // Optional

        // Subscription Info

        [Required]
        public SubscriptionTypeEnum SubscriptionTier { get; set; } = SubscriptionTypeEnum.Free; // Always tracked

        [Required]
        public bool SubscriptionIsActive { get; set; } = true;  // Always tracked (true if valid)

        public DateTime? SubscriptionStartDate { get; set; }  // Optional: if tracking when sub began
        public DateTime? SubscriptionEndDate { get; set; }    // Optional: if you track end/expiry

        [MaxLength(20)]
        public BillingCycleEnum BillingCycle { get; set; }   // e.g., "Monthly" / "Annually" - Optional

        // Optional: Stripe or PayPal identifiers (for billing links)

        [MaxLength(100)]
        public string? StripeCustomerId { get; set; }   // Optional

        [MaxLength(100)]
        public string? PayPalSubscriptionId { get; set; }  // Optional

        // Household/group sharing (optional)

        public Guid? HouseholdId { get; set; }  // Optional

        // Related collections

        public virtual ICollection<Income> Incomes { get; set; } = new List<Income>();
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();
        public virtual ICollection<RecurringItem> RecurringItems { get; set; } = new List<RecurringItem>();


    }
}
