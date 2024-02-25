using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Interfaces
{
    public interface ITicketSolutionRepository
    {
        public TicketSolution CreateSolution(Ticket ticket, TicketSolution ticketSolution);
        public TicketSolution UpdateSolution(TicketSolution ticketSolution);
        public Ticket GetTicket(string ticketId);
        public TicketSolution GetTicketSolution(string ticketId);
        public List<Ticket> GetAllTicketSolution(string reportsTo, string search, string column, bool? sort, int page, int pageSize, bool? date);
        public int GetCountAllTicketSolution(string reportsTo, string search, bool? date);
        public List<Ticket> GetAllTicketSolutionForTs(string id, string search, string column, bool? sort, int page, int pageSize, bool? date);
        public int GetCountAllTicketSolutionForTs(string id, string search, bool? date);
        public Ticket GetDetailTicket(string id);

    }
}
