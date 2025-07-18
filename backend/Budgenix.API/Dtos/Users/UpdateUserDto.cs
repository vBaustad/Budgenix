namespace Budgenix.Dtos.Users
{
    public class UpdateUserDto
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string AddressLine1 { get; set; } = "";
        public string AddressLine2 { get; set; } = "";
        public string City { get; set; } = "";
        public string StateOrProvince { get; set; } = "";
        public string ZipOrPostalCode { get; set; } = "";
        public string Country { get; set; } = "";
    }
}
