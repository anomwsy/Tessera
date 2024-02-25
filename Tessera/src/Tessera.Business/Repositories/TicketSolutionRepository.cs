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
    public class TicketSolutionRepository : ITicketSolutionRepository
    {
        private readonly TesseraContext _dbContext;

        public TicketSolutionRepository(TesseraContext dbContext)
        {
            _dbContext = dbContext;
        }

        public TicketSolution CreateSolution(Ticket ticket,TicketSolution ticketSolution)
        {
            _dbContext.TicketSolutions.Add(ticketSolution);
            _dbContext.Tickets.Update(ticket);
            _dbContext.SaveChanges();
            return ticketSolution;
        }

        public TicketSolution UpdateSolution(TicketSolution ticketSolution)
        {
            _dbContext.TicketSolutions.Update(ticketSolution);
            _dbContext.SaveChanges();
            return ticketSolution;
        }

        public Ticket GetTicket(string ticketId)
        {
            var ticket = _dbContext.Tickets.Include(t=>t.AppointedToNavigation).FirstOrDefault(t => t.Id == ticketId);
            return ticket;
        }

        public TicketSolution GetTicketSolution(string ticketId)
        {
            var ticket = _dbContext.TicketSolutions.FirstOrDefault(t => t.Id == ticketId);
            return ticket;
        }

        public List<Ticket> GetAllTicketSolution(string reportsTo, string search, string column, bool? sort, int page, int pageSize, bool? date)
        {
            var now = DateTime.Now;
            var year = now.Year;
            var month = now.Month;
            if(date == true)
            {
                month = month + 1;
            }
            else if(date == false)
            {
                month = month - 1;
            }
            var tickets = _dbContext.Tickets
                    .Where(
                         e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.WorkStatus.Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && (e.AppointedToNavigation.ReportsTo == reportsTo) 
                         && (e.TicketSolution != null && e.TicketSolution!.SupervisorReviewDate != null)
                         && (e.CreatedDate.Year == year && e.CreatedDate.Month == month)
                    );

            var sortappeals = tickets;
            if (column != null && column != "")
            {
                if (sort == true)
                {
                    sortappeals = tickets.OrderBy(c => EF.Property<object>(c, column));
                }
                else if (sort == false)
                {
                    sortappeals = tickets.OrderByDescending(c => EF.Property<object>(c, column));
                }
            }


            return sortappeals.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        public int GetCountAllTicketSolution(string reportsTo, string search, bool? date)
        {
            var now = DateTime.Now;
            var year = now.Year;
            var month = now.Month;
            if (date == true)
            {
                month = month + 1;
            }
            else if (date == false)
            {
                month = month - 1;
            }
            var tickets = _dbContext.Tickets
                    .Where(
                         e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.WorkStatus.Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && (e.AppointedToNavigation.ReportsTo == reportsTo)
                         && (e.TicketSolution != null && e.TicketSolution!.SupervisorReviewDate != null)
                         && (e.CreatedDate.Year == year && e.CreatedDate.Month == month)
                    );

            return tickets.Count();
        }
        public List<Ticket> GetAllTicketSolutionForTs(string id, string search, string column, bool? sort, int page, int pageSize, bool? date)
        {
            var now = DateTime.Now;
            var year = now.Year;
            var month = now.Month;
            if (date == true)
            {
                month = month + 1;
            }
            else if (date == false)
            {
                month = month - 1;
            }
            var tickets = _dbContext.Tickets
                    .Where(
                         e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.WorkStatus.Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && (e.AppointedTo == id)
                         && (e.TicketSolution != null && e.TicketSolution!.SupervisorReviewDate != null)
                         && (e.CreatedDate.Year == year && e.CreatedDate.Month == month)
                    );

            var sortappeals = tickets;
            if (column != null && column != "")
            {
                if (sort == true)
                {
                    sortappeals = tickets.OrderBy(c => EF.Property<object>(c, column));
                }
                else if (sort == false)
                {
                    sortappeals = tickets.OrderByDescending(c => EF.Property<object>(c, column));
                }
            }


            return sortappeals.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        public int GetCountAllTicketSolutionForTs(string id, string search, bool? date)
        {
            var now = DateTime.Now;
            var year = now.Year;
            var month = now.Month;
            if (date == true)
            {
                month = month + 1;
            }
            else if (date == false)
            {
                month = month - 1;
            }
            var tickets = _dbContext.Tickets
                    .Where(
                         e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.WorkStatus.Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && (e.AppointedTo == id)
                         && (e.TicketSolution != null && e.TicketSolution!.SupervisorReviewDate != null)
                         && (e.CreatedDate.Year == year && e.CreatedDate.Month == month)
                    );

            return tickets.Count();
        }

        public Ticket GetDetailTicket(string id)
        {
            var ticket = _dbContext.Tickets.Include(t => t.CreatedByNavigation).Include(t => t.AppointedToNavigation).Include(t => t.TicketSolution).FirstOrDefault(t => t.Id == id);
            return ticket;
        }
    }
}
