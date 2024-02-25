using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Interfaces
{
    public interface IAuthRepository
    {
        public User GetUserByUserName(string userName);
        public User GetUserById(string userId);
        public User Register(User user, Employee employee);
        public string GenerateUserId(DateTime birthDate);
        public List<Role> GetRoles();
        public User UpdateUser(User user);
        public Employee GetEmployeeById(string id);
        public List<User> GetUserRoleAdminAndManager();
    }
}
