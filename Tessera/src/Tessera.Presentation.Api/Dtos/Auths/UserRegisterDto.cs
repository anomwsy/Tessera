using Tessera.DataAccess.Models;

namespace Tessera.Presentation.Api.Dtos.Auths
{
    public class UserRegisterDto
    {
        public string Id { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public DateTime BirthDate { get; set; }
        public string JobTitle { get; set; } = null!;
        public string? ReportsTo { get; set; }
    }
}
