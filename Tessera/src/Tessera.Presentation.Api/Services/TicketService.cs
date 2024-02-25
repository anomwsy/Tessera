using Microsoft.AspNetCore.Mvc.Rendering;
using Tessera.Business.Interfaces;
using Tessera.Business.Repositories;
using Tessera.DataAccess.Models;
using Tessera.Presentation.Api.Dtos.Tickets;

namespace Tessera.Presentation.Api.Services
{
    public class TicketService
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketService(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        public TicketIndexDto<TicketDto> GetAllTickets(string reportsTo, string search, string column, bool? sort, int page, int pageSize, string workStatus)
        {
            var tickets = _ticketRepository.GetAllTickets(reportsTo, search, column, sort, page, pageSize, workStatus)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Urgency = t.Urgency,
                });

            return new TicketIndexDto<TicketDto>
            {
                Data = tickets.ToList(),
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                InProgress = _ticketRepository.GetTotal(reportsTo, "InProgress"),
                Completed = _ticketRepository.GetTotal(reportsTo, "Completed"),
                Cancelled = _ticketRepository.GetTotal(reportsTo, "Cancelled"),
                TotalPage = (int)Math.Ceiling((decimal)_ticketRepository.TotalCountTickets(reportsTo, search, workStatus) / pageSize)
            };

        }
        public TicketIndexDto<TicketDto> GetAllTicketsForTs(string id, string search, string column, bool? sort, int page, int pageSize, string workStatus)
        {
            var tickets = _ticketRepository.GetAllTicketsForTs(id, search, column, sort, page, pageSize, workStatus)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Urgency = t.Urgency,
                });

            return new TicketIndexDto<TicketDto>
            {
                Data = tickets.ToList(),
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                InProgress = _ticketRepository.GetTotalForTs(id, "InProgress"),
                Completed = _ticketRepository.GetTotalForTs(id, "Completed"),
                Cancelled = _ticketRepository.GetTotalForTs(id, "Cancelled"),
                TotalPage = (int)Math.Ceiling((decimal)_ticketRepository.TotalCountTicketsForTs(id, search, workStatus) / pageSize)
            };

        }
        


        public string CreateTIcket(TicketCreateDto ticket)
        {
            var newId = "SRQ/" + DateTime.Now.Year +"/"+ ticket.AppealId;
            var isAdmin = _ticketRepository.IsAdmin(ticket.CreatedBy);
            if (!isAdmin)
            {
                throw new Exception("Creator is not admin");
            }
            var isTechSupport = _ticketRepository.IsTechSupport(ticket.AppointedTo);
            if (!isTechSupport)
            {
                throw new Exception("Appoint Id is not tech support");
            }
            var newTicket = new Ticket
            {
                Id = newId,
                Title = ticket.Title,
                Details = ticket.Details,
                CreatedDate = DateTime.Now,
                DueDate = ticket.DueDate,
                Urgency = ticket.Urgency,
                WorkStatus = "InProgress",
                CreatedBy = ticket.CreatedBy,
                AppointedTo = ticket.AppointedTo,
                AppealId = ticket.AppealId
            };

            _ticketRepository.CreateTicket(newTicket);

            return "Ticket " + newTicket.Id + " has created";
        }

        public List<SelectListItem> GetAppointedToList(string reportsTo)
        {
            var techSupports = _ticketRepository.AppointedToList(reportsTo)
                .Select(e => new SelectListItem
                {
                    Value = e.Id,
                    Text = e.FirstName + " " + e.LastName
                });

            return techSupports.ToList();
        }

        public TicketDetailDto GetTicketDetail(string year, string id)
        {
            var ticketId = "SRQ/"+year+"/"+id;
            var ticket = _ticketRepository.GetDetailTicket(ticketId);
            string dateLine = "";
            var range = ticket.DueDate - DateTime.Now;
            var day = range.Days;
            if (day > 1)
            {
                dateLine = day.ToString() + " Day";
            }
            else if (day == 1)
            {
                dateLine = "Tomorrow";
            }
            else if (day == 0)
            {
                dateLine = "Today";
            }
            else
            {
                dateLine = ticket.DueDate.ToString("dd MMMM yyyy");
            };
            return new TicketDetailDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Details = ticket.Details,
                CreatedBy = ticket.CreatedByNavigation.FirstName + " " + ticket.CreatedByNavigation.LastName,
                AppointedTo = ticket.AppointedToNavigation.FirstName + " " + ticket.AppointedToNavigation.LastName,
                Urgency = ticket.Urgency,
                DateLine = dateLine,
                WorkStatus = ticket.WorkStatus,
                Description = ticket.TicketSolution?.Details,
                CompletedDate = ticket.TicketSolution?.CompletedDate.ToString("dd MMMM yyyy"),
                CompletedStatus = ticket.TicketSolution?.CompletionStatus,
                ReviewDate = ticket.TicketSolution?.SupervisorReviewDate?.ToString("dd MMMM yyyy") ?? "Pending"

            };
        }


    }
}
