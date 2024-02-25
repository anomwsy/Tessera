using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tessera.Presentation.Api.Dtos.Appeals;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Controllers
{
    [Route("api/v1/Appeal")]
    [ApiController]
    public class AppealController : Controller
    {
        private readonly AppealService _appealService;

        public AppealController(AppealService appealService)
        {
            _appealService = appealService;
        }


        [HttpGet]
        [Authorize(Roles = "Admin, Manager")]
        public IActionResult GetAllAppeals(string? reportsTo, string? search, string? column, bool? sort, int page = 1, int pageSize = 10)
        {
            try
            {
                var respones = _appealService.GetAllAppeals(reportsTo, search, column, sort, page, pageSize);
                return Ok(respones);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public IActionResult GetAppeal(int id)
        {
            try
            {
                var response = _appealService.GetAppeal(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult RejectAppeal(int id)
        {
            try
            {
                var response = _appealService.RejectAppeal(id);
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


        [HttpPost]
        public IActionResult InsertAppeal(AppealInsertDto dto)
        {
            try
            {
                var response = _appealService.InserAppeals(dto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
