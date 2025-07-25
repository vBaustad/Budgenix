using Microsoft.AspNetCore.Mvc;

namespace Budgenix.Dtos.BankStatements
{
    public class UploadBankStatementDto
    {
        public required string Text { get; set; }
        public required string Bank { get; set; }
    }
}
