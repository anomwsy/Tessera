using Microsoft.AspNetCore.Mvc;
using Tessera.Presentation.Api.Dtos.Auths;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Controllers
{
    [Route("api/v1/Auth")]    
    [ApiController]
    public class AuthController : Controller
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public IActionResult Login(UserLoginDto vm)
        {
            try
            {
                var response = _authService.CreateToken(vm);
                return Ok(response);
            }
            catch (Exception ex) { 
                return BadRequest(ex.Message);
            }
        }
    }
}
