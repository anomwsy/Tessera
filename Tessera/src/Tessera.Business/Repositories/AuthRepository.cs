using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.Business.Interfaces;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly TesseraContext _dbContext;

        public AuthRepository(TesseraContext dbContext)
        {
            _dbContext = dbContext;
        }

        public User GetUserById(string userId)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id.Equals(userId));
            return user;
        }

        public User GetUserByUserName(string userName)
        {
            var user = _dbContext.Users
                .FirstOrDefault(u => u.Username.Equals(userName));
            if (!string.Equals(user?.Username, userName, StringComparison.Ordinal))
            {
                throw new KeyNotFoundException("Username salah atau tidak terdaftar");
            }
            return user;
        }

        public Employee GetEmployeeById(string id)
        {
            var user = _dbContext.Employees
                .FirstOrDefault(u => u.Id.Equals(id));
            return user;
        }

        public string GenerateUserId(DateTime birthDate)
        {
            string day = birthDate.Day.ToString();
            string month = birthDate.Month.ToString();
            string year = birthDate.Year.ToString().Substring(3,2);
            Random random = new Random();
            string randomNumber = random.Next(10, 100).ToString();

            string newId = day+month+year+randomNumber;

            return newId;
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


        public User UpdateUser(User user)
        {
            _dbContext.Users.Update(user);
            _dbContext.SaveChanges();
            return user;
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

        public List<User> GetUserRoleAdminAndManager()
        {
            var users = _dbContext.Users.Where(u => u.Role == Role.Admin || u.Role == Role.Manager);
            return users.ToList();
        }
    }
}
