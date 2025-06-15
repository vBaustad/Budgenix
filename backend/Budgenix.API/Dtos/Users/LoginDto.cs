using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Users
{
    public class LoginDto
    {
        public required string Login { get; set; }  // Username or Email
        public required string Password { get; set; }
    }

}
