using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tessera.DataAccess.Models;

namespace Tessera.DataAccess
{
    public class Dependencies
    {
        public static void AddDataAccessServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<TesseraContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("TesseraConnection"))
            );
        }
    }
}
