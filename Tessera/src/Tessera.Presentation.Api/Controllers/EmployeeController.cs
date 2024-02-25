using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tessera.Presentation.Api.Dtos.Employees;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Controllers
{
    [Route("api/v1/Employee")]
    [Authorize(Roles = "Manager, Admin")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly EmployeeService _employeeService;

        public EmployeeController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult GetAllEmployee(string? search, string? column, bool? sort, int page = 1, int pageSize = 10)
        {
            try
            {
                var response = _employeeService.GetEmployees(search, column, sort, page, pageSize);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetEmployeeByID(string? id)
        {
            try
            {
                var response = _employeeService.GetEmployeeByID(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("DropDown")]
        public IActionResult GetDropDown()
        {
            try
            {
                var response = new EmployeeDetailViewDto
                {
                    Managers = _employeeService.GetManagers(),
                    Roles = _employeeService.GetRoles(),
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult RegisterEmployee(EmployeeUpsertDto dto)
        {
            try
            {
                var response = _employeeService.RegisterEmployee(dto);
                return Ok(new
                {
                    message = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public IActionResult UpdateEmployee(EmployeeUpsertDto dto)
        {
            try
            {
                var response = _employeeService.UpdateEmployee(dto);
                return Ok(new
                {
                    message = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(string id)
        {
            try
            {
                var response = _employeeService.DeleteEmployee(id);
                return Ok(new
                {
                    message = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("TechSupport")]
        public IActionResult GetTechSupports(string reportsTo, string? search, string? column, bool? sort, bool? duty, int page = 1, int pageSize = 10)
        {
            try
            {
                var response = _employeeService.GetTechSupports(reportsTo, search, column, sort, page, pageSize, duty);
                return Ok(response);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
