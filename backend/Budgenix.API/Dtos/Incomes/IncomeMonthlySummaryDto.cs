namespace Budgenix.Dtos.Incomes
{
    public class IncomeMonthlySummaryDto
    {
        public DateTime Month { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal Total { get; set; }
    }
}
