namespace Budgenix.Dtos.Goals
{
    public class UpdateGoalDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime? TargetDate { get; set; }
    }
}
