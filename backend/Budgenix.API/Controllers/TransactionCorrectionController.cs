using Budgenix.Dtos.Learning;
using Budgenix.Services.Learning;
using Budgenix.Services.User;
using Microsoft.AspNetCore.Mvc;

namespace Budgenix.API.Controllers
{
    [ApiController]
    [Route("api/transaction-corrections")]
    public class TransactionCorrectionController : ControllerBase
    {
        private readonly TransactionCorrectionService _service;
        private readonly IUserService _userService;

        public TransactionCorrectionController(TransactionCorrectionService service, IUserService userService)
        {
            _service = service;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody] SaveTransactionCorrectionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = _userService.GetUserId();

            await _service.SaveCorrectionAsync(
                userId: userId,
                matchText: dto.MatchText,
                category: dto.Category,
                isIncome: dto.IsIncome,
                type: dto.TransactionType
            );

            return Ok(new { message = "Correction rule saved successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = _userService.GetUserId();
            var rules = await _service.GetCorrectionsForUserAsync(userId);
            return Ok(rules);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateTransactionCorrectionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = _userService.GetUserId();
            var success = await _service.UpdateCorrectionAsync(userId, dto);

            if (!success)
                return NotFound();

            return Ok(new { message = "Correction updated." });
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = _userService.GetUserId();
            var success = await _service.DeleteCorrectionAsync(userId, id);

            if (!success)
                return NotFound();

            return Ok(new { message = "Correction deleted." });
        }


    }
}
