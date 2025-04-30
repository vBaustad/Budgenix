using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Users
{
    public class RegisterDto
    {
        [Required]
        public required string UserName { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
