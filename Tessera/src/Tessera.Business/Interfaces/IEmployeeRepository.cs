using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Interfaces
{
    public interface IEmployeeRepository
    {
        public List<Employee> GetAllEmployees(string search, string column, bool? sort, int page, int pageSize);
        public int TotalCountEmployees(string search);
        public Employee GetEmployeeById(string id);
        public User Register(User user, Employee employee);
        public Employee Update(Employee employee);
        public string GenerateUserId(DateTime date);
        public List<Role> GetRoles();
        public List<Employee> GetManagers();
        public List<Employee> GetAllTechSupports(string reportsTo, string search, string column, bool? sort, int page, int pageSize, bool? duty);
        public int TotalCountTechSupports(string reportsTo, string search, bool? duty);
    }
}
