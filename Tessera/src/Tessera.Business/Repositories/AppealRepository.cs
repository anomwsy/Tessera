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
    public class AppealRepository : IAppealRepository
    {
        private readonly TesseraContext _dbContext;

        public AppealRepository(TesseraContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Appeal GetById(int id)
        {
            var appeal = _dbContext.Appeals.Include(a=>a.Tickets).FirstOrDefault(a => a.Id == id);
            return appeal;
        }

        public List<Appeal> GetAllAppeals(string reportsTo, string search, string column, bool? sort, int page, int pageSize)
        {
            var appeals = _dbContext.Appeals
                .Include(a => a.Tickets)
                .Where(
                    e =>
                    ((e.Subject).Contains(search) ||
                    (e.Email.Contains(search)) ||
                    (e.Description.Contains(search)) || search == null || search == ""
                    ) && (e.Tickets.Count() == 0 || e.Tickets.Any(t=>t.WorkStatus  == "InProgress" && t.AppointedToNavigation.ReportsTo == reportsTo)) 
                    
                );

            var sortappeals = appeals.OrderByDescending(c=>c.Id);
            if (column != null && column != "")
            {
                if (sort == true)
                {
                    sortappeals = appeals.OrderBy(c => EF.Property<object>(c, column));
                }
                else if (sort == false)
                {
                    sortappeals = appeals.OrderByDescending(c => EF.Property<object>(c, column));
                }
            }


            return sortappeals.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        }

        public int TotalCountAppeals(string search)
        {
            var appeals = _dbContext.Appeals
                .Where(
                    e =>
                    ((e.Subject).Contains(search) ||
                    (e.Email.Contains(search)) ||
                    (e.Description.Contains(search)) || search == null || search == ""
                    ) && (e.Tickets.Count() == 0 || e.Tickets.Any(t => t.WorkStatus == "InProgress"))
                );

            return appeals.Count();
        }

        public Appeal InsertAppeal(Appeal appeal)
        {
            _dbContext.Appeals.Add(appeal);
            _dbContext.SaveChanges();
            return appeal;
        }

        public Appeal RejectAppeal(int id)
        {
            var appeal = GetById(id);
            if( appeal.Tickets.Count() != 0)
            {
                throw new Exception("This appeal cannot reject");
            }
            _dbContext.Appeals.Remove(appeal);
            _dbContext.SaveChanges();
            return appeal;
        }

    }
}
