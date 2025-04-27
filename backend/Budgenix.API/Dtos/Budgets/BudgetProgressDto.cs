namespace Budgenix.Dtos.Budgets
{
    public class BudgetProgressDto
    {
        public Guid Id { get; set; }  // <- Consistent with your other DTOs
        public string Name { get; set; } = string.Empty;
        public decimal AllocatedAmount { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal RemainingAmount => AllocatedAmount - TotalSpent;
        public double PercentUsed => AllocatedAmount == 0 ? 0 : (double)(TotalSpent / AllocatedAmount) * 100;
        public bool IsOverBudget => TotalSpent > AllocatedAmount;
    }

}
