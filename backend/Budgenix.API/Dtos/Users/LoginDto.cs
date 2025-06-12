using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Users
{
    public class LoginDto
    {
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
