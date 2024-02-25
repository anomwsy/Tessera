namespace Tessera.Presentation.Api.Dtos.Employees
{
    public class EmployeeUpsertDto
    {
        public string? Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime? HireDate { get; set; }
        public string JobTitle { get; set; }
        public string? ReportsTo { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
