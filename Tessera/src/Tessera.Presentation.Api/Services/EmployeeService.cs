using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Tessera.Business.Interfaces;
using Tessera.Business.Repositories;
using Tessera.DataAccess.Models;
using Tessera.Presentation.Api.Dtos.Auths;
using Tessera.Presentation.Api.Dtos.Employees;

namespace Tessera.Presentation.Api.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }
        public string RegisterEmployee(EmployeeUpsertDto dto)
        {
            var newId = _employeeRepository.GenerateUserId(DateTime.Now);
            var employee = new Employee
            {
                Id = newId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                BirthDate = dto.BirthDate,
                HireDate = DateTime.Now,
                JobTitle = dto.JobTitle,
                ReportsTo = (dto.Role == "Manager") ? null : dto.ReportsTo
            };
            var user = new User
            {
                Id = newId,
                Username = dto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = (Role)Enum.Parse(typeof(Role), dto.Role)
            };

            _employeeRepository.Register(user, employee);
            return "add employee success";
        }
        public string UpdateEmployee(EmployeeUpsertDto dto)
        {
            var employee = _employeeRepository.GetEmployeeById(dto.Id);
            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.BirthDate = dto.BirthDate;
            employee.Email = dto.Email;
            employee.PhoneNumber = dto.PhoneNumber;
            employee.JobTitle = dto.JobTitle;
            employee.ReportsTo = dto.ReportsTo == "" ? null : dto.ReportsTo;

            _employeeRepository.Update(employee);

            return $"Update {employee.Id} Success";
        }
        public string DeleteEmployee(string id) {
            var employee = _employeeRepository.GetEmployeeById(id);
            employee.DeletedDate = DateTime.Now;
            _employeeRepository.Update(employee);
            return $"Delete {employee.Id} Success";
        }
        public EmployeeIndexDto<EmployeeDto> GetEmployees(string search, string column, bool? sort, int page, int pageSize)
        {
            var employees = _employeeRepository.GetAllEmployees(search, column, sort, page, pageSize).Select(
                e => new EmployeeDto
                {
                    Id = e.Id,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Email = e.Email,
                    JobTitle = e.JobTitle,
                    ReportsTo = e.ReportsToNavigation != null ? e.ReportsToNavigation.FirstName + " " + e.ReportsToNavigation.LastName : "",
                }).ToList();

            return new EmployeeIndexDto<EmployeeDto>
            {
                Employees = employees,
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                TotalPage = (int)Math.Ceiling((decimal)_employeeRepository.TotalCountEmployees(search) / pageSize)
            };
        }

        public EmployeeDetailDto GetEmployeeByID(string id)
        {
            var employee = _employeeRepository.GetEmployeeById(id);
            var dto = new EmployeeDetailDto
            {
                Id = employee.Id,
                Role = employee.User.Role.GetLabel(),
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                PhoneNumber = employee.PhoneNumber,
                BirthDate = employee.BirthDate,
                HireDate = employee.HireDate,
                JobTitle = employee.JobTitle,
                ReportsTo = employee.ReportsTo
            };
            return dto;
        }

        public List<SelectListItem> GetRoles()
        {
            var roles = _employeeRepository.GetRoles()
                .Select(r=> new SelectListItem
                {
                    Value = r.ToString(),
                    Text = r.GetLabel()
                }).ToList();
            return roles;
            
        }

        public List<SelectListItem> GetManagers()
        {
            var employees = _employeeRepository.GetManagers()
                .Select(m => new SelectListItem
                {
                    Value= m.Id,
                    Text=m.FirstName+" "+m.LastName
                }).ToList();
            return employees;
        }

        public EmployeeIndexDto<EmployeeTechSupportDto> GetTechSupports(string reportsTo, string search, string column, bool? sort, int page, int pageSize, bool? duty)
        {
            var employees = _employeeRepository.GetAllTechSupports(reportsTo, search, column, sort, page, pageSize, duty)
                .Select(e=> new EmployeeTechSupportDto
                {
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Email = e.Email,
                    JobTitle = e.JobTitle,
                    ReportsTo = e.ReportsToNavigation != null ? e.ReportsToNavigation.FirstName + " " + e.ReportsToNavigation.LastName : "",
                    Ticket = e.TicketAppointedToNavigations
                    .Where(t=>(duty == true ? t.WorkStatus == "InProgress" : (duty == false ? t.WorkStatus == "InProgress" : false)))
                    .Select(t=> new EmployeeTSTicketDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        Urgency = t.Urgency,
                    }).ToList(),
                }).ToList();

            return new EmployeeIndexDto<EmployeeTechSupportDto>
            {
                Employees = employees,
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                TotalPage = (int)Math.Ceiling((decimal)_employeeRepository.TotalCountTechSupports(reportsTo, search, duty) / pageSize)
            };
        }

    }
}
