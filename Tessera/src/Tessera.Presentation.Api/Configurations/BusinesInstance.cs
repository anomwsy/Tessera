using Microsoft.EntityFrameworkCore.Migrations;
using Tessera.Business.Interfaces;
using Tessera.Business.Repositories;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Configurations
{
    public static class BusinesInstance
    {
        public static IServiceCollection AddBusinessService(this IServiceCollection service)
        {
            //Repository
            service.AddScoped<IAuthRepository, AuthRepository>();
            service.AddScoped<IEmployeeRepository, EmployeeRepository>();
            service.AddScoped<IAppealRepository, AppealRepository>();
            service.AddScoped<ITicketRepository, TicketRepository>();
            service.AddScoped<ITicketSolutionRepository, TicketSolutionRepository>();




            //Service
            service.AddScoped<AuthService>();
            service.AddScoped<EmployeeService>();
            service.AddScoped<AppealService>();
            service.AddScoped<TicketService>();
            service.AddScoped<TicketSolutionService>();


            return service;
        }
    }
}
