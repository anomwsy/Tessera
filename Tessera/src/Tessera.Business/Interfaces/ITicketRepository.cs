using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Interfaces
{
    public interface ITicketRepository
    {
        public Ticket CreateTicket(Ticket ticket);
        public List<Ticket> GetAllTickets(string reportsTo, string search, string column, bool? sort, int page, int pageSize, string workStatus);
        public int TotalCountTickets(string reportsTo, string search, string workStatus);
        public bool IsAdmin(string id);
        public bool IsTechSupport(string id);
        public List<Employee> AppointedToList(string reportsTo);
        public void UpdateTicket(Ticket ticket, TicketSolution ticketSolution);
        public List<Ticket> GetAllTicketsForTs(string id, string search, string column, bool? sort, int page, int pageSize, string workStatus);
        public int TotalCountTicketsForTs(string id, string search, string workStatus);
        public Ticket GetDetailTicket(string id);
        public int GetTotal(string reportsTo, string workStatus);
        public int GetTotalForTs(string id, string workStatus);

    }
}
