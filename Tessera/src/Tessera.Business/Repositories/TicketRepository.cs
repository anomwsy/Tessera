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
    public class TicketRepository : ITicketRepository
    {
        private readonly TesseraContext _dbContext;

        public TicketRepository(TesseraContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Ticket> GetAllTickets(string reportsTo, string search, string column, bool? sort, int page, int pageSize, string workStatus)
        {
            var tickets = _dbContext.Tickets
                    .Include(a => a.AppointedToNavigation)
                    .Where(
                         e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && ((workStatus == null || workStatus == "" || workStatus == "null") ? e.WorkStatus == "InProgress" : e.WorkStatus == workStatus)
                         && (
                         e.AppointedToNavigation.ReportsTo == reportsTo
                         ) && (e.TicketSolution == null || e.TicketSolution!.SupervisorReviewDate == null)
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

        public Ticket CreateTicket(Ticket ticket)
        {
            _dbContext.Tickets.Add(ticket);
            _dbContext.SaveChanges();
            return ticket;
        }

        public int TotalCountTickets(string reportsTo, string search, string workStatus)
        {
            var tickets = _dbContext.Tickets
                    .Include(a => a.AppointedToNavigation)
                    .Where(
                            e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && ((workStatus == null || workStatus == "" || workStatus == "null") ? e.WorkStatus == "InProgress" : e.WorkStatus == workStatus)
                         && (
                         e.AppointedToNavigation.ReportsTo == reportsTo
                         ) && (e.TicketSolution == null || e.TicketSolution!.SupervisorReviewDate == null)
                    );

            return tickets.Count();
        }

        public bool IsAdmin(string id)
        {
            var admin = _dbContext.Users.FirstOrDefault(u => u.Id == id);
            if (admin != null && admin.Role == Role.Admin)
            {
                return true;
            }
            return false;
        }

        public bool IsTechSupport(string id)
        {
            var TechSupport = _dbContext.Users.FirstOrDefault(u => u.Id == id);
            if (TechSupport != null && TechSupport.Role == Role.TechSupport)
            {
                return true;
            }
            return false;
        }

        public List<Employee> AppointedToList(string reportsTo)
        {
            var techSupport = _dbContext.Employees
                .Where(e => e.User.Role == Role.TechSupport && e.ReportsTo != null && e.ReportsTo == reportsTo);

            return techSupport.ToList();
        }

        public void UpdateTicket(Ticket ticket, TicketSolution ticketSolution)
        {
            _dbContext.Tickets.Update(ticket);
            _dbContext.TicketSolutions.Update(ticketSolution);
            _dbContext.SaveChanges();
        }

        public List<Ticket> GetAllTicketsForTs(string id, string search, string column, bool? sort, int page, int pageSize, string workStatus)
        {
            var tickets = _dbContext.Tickets
                    .Include(a => a.AppointedToNavigation)
                    .Where(
                         e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && ((workStatus == null || workStatus == "" || workStatus == "null") ? e.WorkStatus == "InProgress" : e.WorkStatus == workStatus)
                         && (
                         e.AppointedTo == id
                         ) && (e.TicketSolution == null || e.TicketSolution!.SupervisorReviewDate == null)
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

        public int TotalCountTicketsForTs(string id, string search, string workStatus)
        {
            var tickets = _dbContext.Tickets
                    .Include(a => a.AppointedToNavigation)
                    .Where(
                            e =>
                         ((e.Title).Contains(search) ||
                         (e.DueDate.ToString().Contains(search)) ||
                         (e.Urgency.Contains(search)) || search == null || search == ""
                         ) && ((workStatus == null || workStatus == "" || workStatus == "null") ? e.WorkStatus == "InProgress" : e.WorkStatus == workStatus)
                         && (
                         e.AppointedTo == id
                         ) && (e.TicketSolution == null || e.TicketSolution!.SupervisorReviewDate == null)
                    );

            return tickets.Count();
        }

        public Ticket GetDetailTicket(string id)
        {
            var ticket = _dbContext.Tickets.Include(t => t.CreatedByNavigation).Include(t => t.AppointedToNavigation).Include(t => t.TicketSolution).FirstOrDefault(t => t.Id == id);
            return ticket;
        }
        public int GetTotal(string reportsTo, string workStatus)
        {
            var tickets = _dbContext.Tickets
                 .Include(a => a.AppointedToNavigation)
                 .Where(e =>
                        ((workStatus == null || workStatus == "" || workStatus == "null") ? e.WorkStatus == "InProgress" : e.WorkStatus == workStatus)
                         && (e.AppointedToNavigation.ReportsTo == reportsTo)
                         && (e.TicketSolution == null || e.TicketSolution!.SupervisorReviewDate == null)
                 );

            return tickets.Count();
        }
        public int GetTotalForTs(string id, string workStatus)
        {
            var tickets = _dbContext.Tickets
                 .Include(a => a.AppointedToNavigation)
                 .Where(e =>
                        ((workStatus == null || workStatus == "" || workStatus == "null") ? e.WorkStatus == "InProgress" : e.WorkStatus == workStatus)
                         && (e.AppointedTo == id) 
                         && (e.TicketSolution == null || e.TicketSolution!.SupervisorReviewDate == null)
                 );

            return tickets.Count();
        }
    }
}
