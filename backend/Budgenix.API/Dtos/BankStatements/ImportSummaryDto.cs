namespace Budgenix.Dtos.BankStatements
{
    public class ImportSummaryDto
    {
        public int TotalReceived { get; set; }
        public int ImportedIncomes { get; set; }
        public int ImportedExpenses { get; set; }
        public int Skipped { get; set; }
        public int AiNamesGenerated { get; set; } 
        public List<string> Warnings { get; set; } = new();
    }

}
