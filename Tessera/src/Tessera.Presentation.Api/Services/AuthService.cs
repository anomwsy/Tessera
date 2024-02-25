using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tessera.Business.Interfaces;
using Tessera.DataAccess.Models;
using Tessera.Presentation.Api.Dtos.Auths;
using Tessera.Presentation.Api.Helpers;

namespace Tessera.Presentation.Api.Services
{
    public class AuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        public AuthService(IConfiguration configuration, IAuthRepository authRepository)
        {
            _configuration = configuration;
            _authRepository = authRepository;
        }

        public void Register(UserRegisterDto vm)
        {
            var employee = new Employee
            {
                Id = _authRepository.GenerateUserId(vm.BirthDate),
                FirstName = vm.FirstName,
                LastName = vm.LastName,
                Email = vm.Email,
                PhoneNumber = vm.PhoneNumber,
                BirthDate = vm.BirthDate,
                HireDate = DateTime.Now,
                JobTitle = vm.JobTitle,
                ReportsTo = vm.Role == "Manager" ? null : vm.ReportsTo
            };
            var user = new User
            {
                Id = employee.Id,
                Username = vm.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(vm.Password),
                Role = (Role)Enum.Parse(typeof(Role), vm.Role)
            };

            _authRepository.Register(user, employee);
        }

        public AuthResponseDto CreateToken(UserLoginDto request)
        {
            var user = _authRepository.GetUserByUserName(request.Username);
            var reposrtsTo = _authRepository.GetEmployeeById(user.Id).ReportsTo;
            if (user == null)
            {
                throw new KeyNotFoundException("username tidak ditemukan");
            }
            if (_authRepository.GetEmployeeById(user.Id).DeletedDate != null)
            {
                throw new KeyNotFoundException("username tidak ditemukan");
            }
            if (!user.Username.Equals(request.Username))
            {
                throw new KeyNotFoundException("username tidak ditemukan");
            }
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new KeyNotFoundException("Username atau password salah");
            }


            var algorithm = SecurityAlgorithms.HmacSha256;
            var payload = new List<Claim>
            {
                new Claim("Id", user.Id),
                new Claim(ClaimTypes.NameIdentifier, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };
            if (user.Role != Role.Manager)
            {
                payload.Add(new Claim("ReportsTo", reposrtsTo));
            }
            else
            {
                payload.Add(new Claim("ReportsTo", user.Id));
            }
            ;
            var signature = _configuration.GetSection("AppSettings:TokenSignature").Value;
            var encodedSignature = Encoding.UTF8.GetBytes(signature);
            var token = new JwtSecurityToken(
                claims: payload,
                expires: DateTime.Now.AddDays(30),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(encodedSignature), algorithm)
                );
            var serializeToken = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResponseDto
            {
                Token = serializeToken
            };
        }

        public List<string> GetUsernameRoleAdminAndManager()
        {
            var users = _authRepository.GetUserRoleAdminAndManager()
                .Select(u => u.Username);

            return users.ToList();
        }
    }
}
