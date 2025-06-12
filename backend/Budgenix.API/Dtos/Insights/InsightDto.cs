namespace Budgenix.Dtos.Insights
{
    public enum InsightCategoryEnum
    {
        Expenses,
        Income,
        Budget,
        Goals,
        System
    }

    public class InsightDto
    {
        public string Icon { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? Status { get; set; }
        public InsightCategoryEnum Category { get; set; }
    }

}
