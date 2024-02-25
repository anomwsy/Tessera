using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tessera.Presentation.Api.Dtos.TicketSolutions;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Controllers
{
    [Route("api/v1/TicketSolution")]
    [ApiController]
    [Authorize]
    public class TicketSolutionController : Controller
    {
        private readonly TicketSolutionService _ticketSolutionService;
        public TicketSolutionController(TicketSolutionService ticketService)
        {
            _ticketSolutionService = ticketService;
        }

        [Authorize(Roles = "Admin, TechSupport")]
        [HttpPost]
        public IActionResult CreateTicketSolution(TicketSolutionCreateDto dto)
        {
            try
            {
                var response = _ticketSolutionService.CreateTicketSolution(dto);
                return Ok(response );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize(Roles = "Manager")]
        [HttpPut]
        public IActionResult ReviewTicketSolution(TicketSolutionReviewDto dto)
        {
            try
            {
                var response = _ticketSolutionService.reviewTicket(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet]
        public IActionResult GetAllTickets(string reportsTo, string? search, string? column, bool? sort, bool? date, int page = 1, int pageSize = 10)
        {
            try
            {
                var response = _ticketSolutionService.GetAllTicketSolution(reportsTo, search, column, sort, page, pageSize, date);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "TechSupport")]
        [HttpGet("TS")]
        public IActionResult GetAllTicketsForTS(string id, string? search, string? column, bool? sort, bool? date, int page = 1, int pageSize = 10)
        {
            try
            {
                var response = _ticketSolutionService.GetAllTicketSolutionForTs(id, search, column, sort, page, pageSize, date);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
