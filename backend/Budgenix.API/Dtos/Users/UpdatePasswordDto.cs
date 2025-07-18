using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Users
{
    public class UpdatePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = "";

        [Required]
        public string NewPassword { get; set; } = "";
    }
}
