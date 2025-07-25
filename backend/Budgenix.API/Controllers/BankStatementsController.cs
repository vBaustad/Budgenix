using Budgenix.Dtos.BankStatements;
using Budgenix.Services.BankStatements.Banks;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/bank-statements")]
    [Authorize]
    public class BankStatementsController : ControllerBase
    {
        private readonly IBankStatementService _service;
        private readonly IUserService _userService;

        public BankStatementsController(IBankStatementService service, IUserService userService)
        {
            _service = service;
            _userService = userService;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<List<ParsedTransactionDto>>> Upload([FromBody] UploadBankStatementDto dto)
        {
            Console.WriteLine($"[UPLOAD] Bank: {dto.Bank}, Text: {(dto.Text?.Length ?? 0)} chars");

            var userId = _userService.GetUserId();
            var result = await _service.ParseAsync(dto.Text, userId, dto.Bank);

            Console.WriteLine($"[UPLOAD] Parsed {result.Count} transactions");

            return Ok(result);
        }
    }
}
