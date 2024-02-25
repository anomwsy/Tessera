using Microsoft.AspNetCore.Mvc.Razor;
using System.Net;
using System.Text.Json;

namespace Tessera.Presentation.Api.Middlewares;

public class ErrorHandleMiddleWare
{
    private readonly RequestDelegate _next;

    public ErrorHandleMiddleWare(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            switch (ex)
            {
                case KeyNotFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    break;
                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            var result = new
            {
                title = ex.Message,
                status = response.StatusCode
            };

            response.WriteAsync(JsonSerializer.Serialize(result)).GetAwaiter().GetResult();
        }
    }
}
