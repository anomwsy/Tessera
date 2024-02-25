namespace Tessera.Presentation.Api.Dtos.Employees
{
    public class EmployeeDetailDto
    {
        public string Id { get; set; } = null!;

        public string Role { get; set; }

        public string FirstName { get; set; } = null!;

        public string? LastName { get; set; }

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public DateTime BirthDate { get; set; }

        public DateTime HireDate { get; set; }

        public string JobTitle { get; set; } = null!;

        public string? ReportsTo { get; set; }
    }
}
