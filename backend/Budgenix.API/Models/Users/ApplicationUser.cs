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
        public DateTime? SubscriptionGracePeriodEnd { get; set; }

        [MaxLength(20)]
        public BillingCycleEnum BillingCycle { get; set; }   // e.g., "Monthly" / "Annually" - Optional

        [MaxLength(100)]
        public string? StripeCustomerId { get; set; }   // Optional
        [MaxLength(100)]
        public string? StripeSubscriptionId { get; set; }  // Optional: link to active Stripe subscription

        [MaxLength(100)]
        public string? PayPalSubscriptionId { get; set; }  // Optional
        public DateTime? SubscriptionLastPaymentDate { get; set; }

        //Referrals
        [MaxLength(50)]
        public string? ReferralCodeUsed { get; set; }  // code the user entered

        [MaxLength(50)]
        public string? ReferralCode { get; set; }  // unique referral code for this user

        public string? GrantedByUserId { get; set; }  // user ID of who granted tier manually

        // Household/group sharing (optional)

        public Guid? HouseholdId { get; set; }  // Optional

        // Discount / Trial fields 

        public bool IsTrial { get; set; } = false;
        public DateTime? TrialEndDate { get; set; }
        public decimal? DiscountPercent { get; set; }  // e.g. 20% off
        public DateTime? DiscountEndDate { get; set; }

        //Financial
        public string PreferredCurrency { get; set; } = "USD"; // Default fallback

        // Related collections

        public virtual ICollection<Income> Incomes { get; set; } = new List<Income>();
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();
        public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();
        public virtual ICollection<RecurringItem> RecurringItems { get; set; } = new List<RecurringItem>();


    }
}
