using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Tessera.Presentation.Api.Services;

namespace Tessera.Presentation.Api.Middlewares
{
    public class WebSocketMiddleWare
    {
        private static ConcurrentDictionary<string, (DataRegistration, WebSocket)> _sockets = new ConcurrentDictionary<string, (DataRegistration, WebSocket)>();

        private readonly RequestDelegate _next;

        public WebSocketMiddleWare(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await _next.Invoke(context);
                return;
            }

            CancellationToken ct = context.RequestAborted;
            WebSocket currentSocket = await context.WebSockets.AcceptWebSocketAsync();

            // Register user with their WebSocket connection
            var socketId = Guid.NewGuid().ToString();
            var userName = await RegisterUserAsync(socketId, currentSocket);

            try
            {
                while (currentSocket.State == WebSocketState.Open)
                {
                    var response = await ReceiveDataAsync(currentSocket, ct);
                    if (string.IsNullOrEmpty(response))
                    {
                        continue;
                    }

                    await ProcessDataAsync(response, socketId);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"WebSocket error: {ex.Message}");
            }
            finally
            {
                await UnregisterUserAsync(userName, socketId);
            }

            await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", ct);
            currentSocket.Dispose();
        }

        private async Task<string> RegisterUserAsync(string socketId, WebSocket socket)
        {
            // Extract user information from registration message
            var registrationJson = await ReceiveDataAsync(socket, CancellationToken.None);
            var registrationData = JsonSerializer.Deserialize<DataRegistration>(registrationJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            _sockets.TryAdd(socketId, (registrationData, socket));

            return registrationData.Username;
        }

        private async Task UnregisterUserAsync(string username, string socketId)
        {
            var socketToRemove = _sockets.FirstOrDefault(x => x.Value.Item1.Username == username && x.Key == socketId);
            if (socketToRemove.Key != null)
            {
                WebSocket dummy;
                _sockets.TryRemove(socketToRemove.Key, out _);
            }
        }

        private async Task ProcessDataAsync(string data, string socketId)
        {
            var dataObj = JsonSerializer.Deserialize<DataTransfer>(data, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (dataObj.RecipientType == "Role")
            {
                var recipientsByRole = _sockets
                    .Where(s => (s.Value.Item1.Role == "Manager" || s.Value.Item1.Role == "Admin") && s.Key != socketId);

                foreach (var recipient in recipientsByRole)
                {
                    if (recipient.Value.Item2.State == WebSocketState.Open)
                    {
                        await SendDataAsync(recipient.Value.Item2, JsonSerializer.Serialize(
                            new
                            {
                                sender = dataObj.Sender,
                                type = dataObj.Type,
                                message = dataObj.Message
                            }));
                    }
                }
            }
            else if (dataObj.RecipientType == "ReportsTo")
            {
                var recipientsByRole = _sockets
                 .Where(s => ((s.Value.Item1.Role == "Manager" || s.Value.Item1.Role == "Admin") && s.Value.Item1.ReportsTo == dataObj.Recipient) && s.Key != socketId);

                foreach (var recipient in recipientsByRole)
                {
                    if (recipient.Value.Item2.State == WebSocketState.Open)
                    {
                        await SendDataAsync(recipient.Value.Item2, JsonSerializer.Serialize(
                            new
                            {
                                sender = dataObj.Sender,
                                type = dataObj.Type,
                                message = dataObj.Message
                            }));
                    }
                }
            }
            else if (dataObj.RecipientType == "AllReportsTo")
            {
                var recipientsByRole = _sockets
                 .Where(s => (s.Value.Item1.ReportsTo == dataObj.Recipient) && s.Key != socketId);

                foreach (var recipient in recipientsByRole)
                {
                    if (recipient.Value.Item2.State == WebSocketState.Open)
                    {
                        await SendDataAsync(recipient.Value.Item2, JsonSerializer.Serialize(
                            new
                            {
                                sender = dataObj.Sender,
                                type = dataObj.Type,
                                message = dataObj.Message
                            }));
                    }
                }
            }
            else if (dataObj.RecipientType == "TechSupport")
            {
                var recipientsByRole = _sockets
                 .Where(s => ((s.Value.Item1.Role == "TechSupport") && s.Value.Item1.Id == dataObj.Recipient) && s.Key != socketId);

                foreach (var recipient in recipientsByRole)
                {
                    if (recipient.Value.Item2.State == WebSocketState.Open)
                    {
                        await SendDataAsync(recipient.Value.Item2, JsonSerializer.Serialize(
                            new
                            {
                                sender = dataObj.Sender,
                                type = dataObj.Type,
                                message = dataObj.Message
                            }));
                    }
                }
            }
        }

        private async Task<string> ReceiveDataAsync(WebSocket socket, CancellationToken ct = default(CancellationToken))
        {
            var buffer = new ArraySegment<byte>(new byte[8192]);
            using (var ms = new MemoryStream())
            {
                WebSocketReceiveResult result;
                do
                {
                    ct.ThrowIfCancellationRequested();

                    result = await socket.ReceiveAsync(buffer, ct);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                } while (!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);
                if (result.MessageType != WebSocketMessageType.Text)
                {
                    return null;
                }

                using (var reader = new StreamReader(ms, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }

        private async Task SendDataAsync(WebSocket socket, string data, CancellationToken ct = default(CancellationToken))
        {
            var buffer = Encoding.UTF8.GetBytes(data);
            var segment = new ArraySegment<byte>(buffer);
            await socket.SendAsync(segment, WebSocketMessageType.Text, true, ct);
        }

        private class DataRegistration
        {
            public string Type { get; set; }
            public string Username { get; set; }
            public string Id { get; set; }
            public string Role { get; set; }
            public string ReportsTo { get; set; }
        }

        private class DataTransfer
        {
            public string Type { get; set; }
            public string Sender { get; set; }
            public string Message { get; set; }
            public string RecipientType { get; set; }
            public string Recipient { get; set; }
        }
    }
}
