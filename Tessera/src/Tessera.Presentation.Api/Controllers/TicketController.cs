using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tessera.Presentation.Api.Dtos.Tickets;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Controllers
{
    [Route("api/v1/Ticket")]
    [ApiController]
    [Authorize]
    public class TicketController : Controller
    {
        private readonly TicketService _ticketService;

        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [Authorize(Roles = "Manager, Admin")]
        [HttpGet]
        public IActionResult GetAllTickets(string reportsTo, string? search, string? column, bool? sort, string workStatus, int page = 1, int pageSize = 10)
        {
            try
            {
                var response = _ticketService.GetAllTickets(reportsTo, search, column, sort, page, pageSize, workStatus);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "TechSupport")]
        [HttpGet("TS")]
        public IActionResult GetAllTicketsForTS(string id, string? search, string? column, bool? sort, string workStatus, int page = 1, int pageSize = 10)
        {
            try
            {
                var response = _ticketService.GetAllTicketsForTs(id, search, column, sort, page, pageSize, workStatus);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult CreateTicket(TicketCreateDto dto)
        {
            try
            {
                var response = _ticketService.CreateTIcket(dto);
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
        [HttpGet("{reportsTo}")]
        public IActionResult TechSupportList(string reportsTo)
        {
            try
            {
                var response = _ticketService.GetAppointedToList(reportsTo);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("SRQ/{year}/{id}")]
        public IActionResult GetDetailTicket(string year, string id)
        {
            try
            {
                var response = _ticketService.GetTicketDetail(year, id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
