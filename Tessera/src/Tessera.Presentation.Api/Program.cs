using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Tessera.DataAccess;
using Tessera.Presentation.Api.Configurations;
using Tessera.Presentation.Api.Middlewares;

namespace Tessera.Presentation.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            Dependencies.AddDataAccessServices(builder.Services, builder.Configuration);

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddBusinessService();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
             .AddJwtBearer(options =>
             options.TokenValidationParameters = new TokenValidationParameters
             {
                 ValidateIssuerSigningKey = true,
                 ValidateIssuer = false,
                 ValidateAudience = false,
                 IssuerSigningKey = new SymmetricSecurityKey(
                     Encoding.UTF8.GetBytes(
                         builder.Configuration.GetSection("AppSettings:TokenSignature").Value
                         ))
             });
            var allowedSpecificOrigin = "_webBasili sk";
            builder.Services.AddCors(options =>
            options.AddPolicy(name: allowedSpecificOrigin,
                                policy => policy.WithOrigins("http://localhost:4200")
                                .AllowAnyMethod()
                                .AllowAnyHeader())
            );
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(allowedSpecificOrigin);
            app.UseWebSockets();
            app.UseMiddleware<Tessera.Presentation.Api.Middlewares.WebSocketMiddleWare>();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();

        }
    }
}