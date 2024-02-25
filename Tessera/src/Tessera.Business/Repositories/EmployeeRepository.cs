using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Tessera.Business.Interfaces;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly TesseraContext _dbContext; 

        public EmployeeRepository(TesseraContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Employee> GetAllEmployees(string search, string column, bool? sort, int page, int pageSize)
        {
            var employees = _dbContext.Employees.Include(e=>e.ReportsToNavigation).Where(e =>
                    ((e.FirstName + " " + e.LastName).Contains(search) ||
                    (e.ReportsToNavigation != null ? (e.ReportsToNavigation.FirstName + " " + e.ReportsToNavigation.LastName).Contains(search) : false) ||
                    (e.Email.Contains(search)) ||
                    (e.JobTitle.Contains(search)) || search == null || search == ""
                    ) && e.DeletedDate == null
                 );
            var sortEmployee = employees;
            if (column != null && column != "")
            {
                if (sort == true)
                {
                    sortEmployee = employees.OrderBy(c => EF.Property<object>(c, column));
                }
                else if (sort == false)
                {
                    sortEmployee = employees.OrderByDescending(c => EF.Property<object>(c, column));
                }
            }


            return sortEmployee.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        public int TotalCountEmployees(string search)
        {
            var employees = _dbContext.Employees.Where(e =>
                    ((e.FirstName + " " + e.LastName).Contains(search) ||
                    (e.Email.Contains(search)) ||
                    (e.JobTitle.Contains(search)) || search == null || search == ""
                    ) && e.DeletedDate == null
                 );

            return employees.Count();
        }

        public Employee GetEmployeeById(string id)
        {
            var employee = _dbContext.Employees.Include(e=>e.ReportsToNavigation).Include(e=>e.User).FirstOrDefault(e => e.Id == id);
            if (employee == null)
            {
                throw new KeyNotFoundException("Employee Not Found");
            }
            return employee;

        }

        public User Register(User user, Employee employee)
        {
            if (_dbContext.Users.Any(a => a.Username.Equals(user.Username)))
            {
                throw new DuplicateWaitObjectException("Username has taken");
            }

            _dbContext.Users.Add(user);
            _dbContext.Employees.Add(employee);
            _dbContext.SaveChanges();
            return user;
        }

        public Employee Update(Employee employee)
        {
            _dbContext.Employees.Update(employee);
            _dbContext.SaveChanges();
            return employee;
        }

        public string GenerateUserId(DateTime date)
        {
            string day = date.Day.ToString();
            string month = date.Month.ToString();
            string year = date.Year.ToString().Substring(2, 2);
            Random random = new Random();
            string randomNumber = random.Next(10, 100).ToString();

            string newId = day + month + year + randomNumber;

            return newId;
        }

        public List<Role> GetRoles()
        {
            var roles = Enum.GetValues(typeof(Role));
            var result = new List<Role>();
            foreach (Role item in roles)
            {
                result.Add(item);
            };

            return result;
        }

        public List<Employee> GetManagers()
        {
            var employees = _dbContext.Employees.Where(e=>e.User.Role == Role.Manager).ToList();
            return employees;
        }

        public List<Employee> GetAllTechSupports(string reportsTo, string search, string column, bool? sort, int page, int pageSize, bool? duty)
        {
            var employees = _dbContext.Employees
                .Include(e => e.TicketAppointedToNavigations).Include(e=> e.ReportsToNavigation)
                .Where(e => (e.User.Role == (Role)Enum.Parse(typeof(Role), "TechSupport") &&
                    (((e.FirstName + " " + e.LastName).Contains(search) ||
                    (e.ReportsToNavigation != null ? (e.ReportsToNavigation.FirstName + " " + e.ReportsToNavigation.LastName).Contains(search) : false) ||
                    (e.Email.Contains(search)) ||
                    (e.JobTitle.Contains(search)) || search == null || search == "")) &&
                    (e.TicketAppointedToNavigations.Any(b => (duty == true ? b.WorkStatus == "InProgress" : (duty == false ? b.WorkStatus != "InProgress" : false))) || (duty == false ? e.TicketAppointedToNavigations.Count() == 0 : false) || duty == null) && e.DeletedDate == null && e.ReportsTo == reportsTo
                ));
            var sortEmployee = employees;
            if (column != null && column != "")
            {
                if (sort == true)
                {
                    sortEmployee = employees.OrderBy(c => EF.Property<object>(c, column));
                }
                else if (sort == false)
                {
                    sortEmployee = employees.OrderByDescending(c => EF.Property<object>(c, column));
                }
            }
            return sortEmployee.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        public int TotalCountTechSupports(string reportsTo, string search, bool? duty)
        {
            var employees = _dbContext.Employees
                .Include(e => e.TicketAppointedToNavigations)
                .Where(e => (e.User.Role == (Role)Enum.Parse(typeof(Role), "TechSupport") &&
                    (((e.FirstName + " " + e.LastName).Contains(search) ||
                    (e.ReportsToNavigation != null ? (e.ReportsToNavigation.FirstName + " " + e.ReportsToNavigation.LastName).Contains(search) : false) ||
                    (e.Email.Contains(search)) ||
                    (e.JobTitle.Contains(search)) || search == null || search == "")) &&
                    (e.TicketAppointedToNavigations.Any(b => (duty == true ? b.WorkStatus == "InProgress" : (duty == false ? b.WorkStatus != "InProgress" : false))) || (duty == false ? e.TicketAppointedToNavigations.Count() == 0 : false) || duty == null) && e.DeletedDate == null && e.ReportsTo == reportsTo
                ));
            return employees.Count();
        }
    }
}
