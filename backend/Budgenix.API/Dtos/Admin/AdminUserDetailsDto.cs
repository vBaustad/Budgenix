using Budgenix.Dtos.Admin;

namespace Budgenix.Dtos.Admin
{
    public class AdminUserDetailsDto : AdminUserDto
    {
        public UserStatsDto Stats { get; set; }
    }

}
