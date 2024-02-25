using Tessera.Business.Interfaces;
using Tessera.Business.Repositories;
using Tessera.DataAccess.Models;
using Tessera.Presentation.Api.Dtos.Tickets;
using Tessera.Presentation.Api.Dtos.TicketSolutions;

namespace Tessera.Presentation.Api.Services
{
    public class TicketSolutionService
    {
        private readonly ITicketSolutionRepository _ticketSolutionRepository;

        public TicketSolutionService(ITicketSolutionRepository ticketSolutionRepository)
        {
            _ticketSolutionRepository = ticketSolutionRepository;
        }

        public TicketSolutionCreateDto CreateTicketSolution(TicketSolutionCreateDto dto)
        {
            var ticket = _ticketSolutionRepository.GetTicket(dto.Id);
            if (ticket == null)
            {
                throw new ArgumentNullException("ticket not found");
            }
            var status = "";
            if (dto.status)
            {
                if (DateTime.Now <= ticket.DueDate)
                {
                    status = "OnTime";
                }
                else
                {
                    status = "Overdue";
                }
                ticket.WorkStatus = "Completed";
            }
            else
            {
                status = "Cancelled";
                ticket.WorkStatus = "Cancelled";
            }
            var newSolution = new TicketSolution
            {
                Id = dto.Id,
                Details = dto.Description,
                CompletedDate = DateTime.Now,
                CompletionStatus = status,
                SupervisorReviewDate = null,
                Supervisor = ticket.AppointedToNavigation.ReportsTo
            };

            var result = _ticketSolutionRepository.CreateSolution(ticket, newSolution);
            return new TicketSolutionCreateDto { Id = result.Id, Description = result.Details };
        }

        public TicketSolutionReviewDto reviewTicket(TicketSolutionReviewDto dto)
        {
            var solution = _ticketSolutionRepository.GetTicketSolution(dto.Id);
            if (solution == null)
            {
                throw new ArgumentNullException("solution not found");
            }

            solution.SupervisorReviewDate = DateTime.Now;
            var newSolution = _ticketSolutionRepository.UpdateSolution(solution);

            return dto;
        }

        public TicketIndexDto<TicketSolutionDto> GetAllTicketSolution(string reportsTo, string search, string column, bool? sort, int page, int pageSize, bool? date)
        {
            var tickets = _ticketSolutionRepository.GetAllTicketSolution(reportsTo, search, column, sort, page, pageSize, date)
                        .Select(t => new TicketSolutionDto
                        {
                            Id = t.Id,
                            Title = t.Title,
                            Urgency = t.Urgency,
                            Status = t.WorkStatus
                        });

            return new TicketIndexDto<TicketSolutionDto>
            {
                Data = tickets.ToList(),
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                TotalPage = (int)Math.Ceiling((decimal)_ticketSolutionRepository.GetCountAllTicketSolution(reportsTo, search, date) / pageSize)
            };
        }

        public TicketIndexDto<TicketSolutionDto> GetAllTicketSolutionForTs(string id, string search, string column, bool? sort, int page, int pageSize, bool? date)
        {
            var tickets = _ticketSolutionRepository.GetAllTicketSolutionForTs(id, search, column, sort, page, pageSize, date)
                        .Select(t => new TicketSolutionDto
                        {
                            Id = t.Id,
                            Title = t.Title,
                            Urgency = t.Urgency,
                            Status = t.WorkStatus
                        });

            return new TicketIndexDto<TicketSolutionDto>
            {
                Data = tickets.ToList(),
                Search = search,
                Page = page,
                Column = column,
                Sort = sort,
                TotalPage = (int)Math.Ceiling((decimal)_ticketSolutionRepository.GetCountAllTicketSolutionForTs(id, search, date) / pageSize)
            };
        }
    }

}
