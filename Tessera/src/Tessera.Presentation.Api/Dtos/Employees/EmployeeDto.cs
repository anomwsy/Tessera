﻿namespace Tessera.Presentation.Api.Dtos.Employees
{
    public class EmployeeDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public string ReportsTo { get; set; }
    }
}
