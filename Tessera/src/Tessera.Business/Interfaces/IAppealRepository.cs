using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.DataAccess.Models;

namespace Tessera.Business.Interfaces
{
    public interface IAppealRepository
    {
        public Appeal GetById(int id);
        public List<Appeal> GetAllAppeals(string reportsTo, string search, string column, bool? sort, int page, int pageSize);
        public Appeal InsertAppeal(Appeal appeal);
        public int TotalCountAppeals(string search);
        public Appeal RejectAppeal(int id);
    }
}
