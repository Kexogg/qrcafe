using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QrCafe.Models;

namespace QrCafe;

[Authorize]
public class ChatController : Hub
{
    public ChatController(QrCafeDbContext context)
    {
        _context = context;
    }
    public QrCafeDbContext _context;
    public async Task Send(string message)
    {
        try
        {
            var role = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value.ToString();
            var restaurantIdClaim = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
            switch (role)
            {
                case "client":
                {
                    if (Context.UserIdentifier is string clientId)
                    {
                        var employee =
                            Context.User.Claims.FirstOrDefault(c => c.Type == "assignedEmployeeId")?.Value.ToString();

                        await Clients.Users(clientId, employee).SendAsync("Receive", message);
                        var messageData = new ChatMessage(message,Guid.Parse(clientId),0);
                        await _context.ChatMessages.AddAsync(messageData);
                        await _context.SaveChangesAsync();
                    }

                    break;
                }
                case "employee":
                {
                    if (Context.UserIdentifier is string employeeId)
                    {
                        var httpContext = Context.GetHttpContext();
                        var clientId = Guid.Parse(httpContext.Request.Query["clientId"]);
                        var client = await _context.Clients.Where(c => c.RestaurantId == restaurantIdClaim)
                            .FirstOrDefaultAsync(c => c.Id == clientId);
                        if (client != null)
                        {
                            await Clients.Users(employeeId, clientId.ToString()).SendAsync("Receive", message);
                            await Clients.Users(clientId.ToString(), employeeId).SendAsync("Receive", message);
                            var messageData = new ChatMessage(message, Guid.Parse(clientId.ToString()), 1);
                            await _context.ChatMessages.AddAsync(messageData);
                            await _context.SaveChangesAsync();
                        }
                    }
                
                    break;
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }
    public override async Task OnConnectedAsync()
    {
        await Clients.All.SendAsync("Notify", "Entered chat");
        var restaurantIdClaim = int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
        var userIdClaim = Guid.Parse(Context.User?.Claims.FirstOrDefault(c => c.Type == "id")?.Value);
        var role = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value.ToString();
        Chat chat;
        if (role == "client")
        {
            var client = await _context.Clients.Where(c => c.RestaurantId == restaurantIdClaim)
                .FirstOrDefaultAsync(c => c.Id == userIdClaim);
            chat = await _context.Chats.Include(c=> c.Messages)
                .Where(c => c.RestaurantId == restaurantIdClaim)
                .FirstOrDefaultAsync(c=> c.Id == userIdClaim);
            if (chat != null) Clients.User(userIdClaim.ToString()).SendAsync("Receive", chat.Messages);
            else
            {
                chat = new Chat(client);
                await _context.Chats.AddAsync(chat);
                await _context.SaveChangesAsync();
            }
        }
        else
        {
            var httpContext = Context.GetHttpContext();
            var clientId = Guid.Parse(httpContext.Request.Query["clientId"]);
            var client = await _context.Clients.Where(c => c.RestaurantId == restaurantIdClaim)
                .FirstOrDefaultAsync(c => c.Id == clientId);
            if (client != null)
            {
                chat = await _context.Chats.Include(c=> c.Messages)
                    .Where(c => c.RestaurantId == restaurantIdClaim)
                    .FirstOrDefaultAsync(c=> c.Id == clientId);
                if (chat != null) Clients.User(userIdClaim.ToString()).SendAsync("Receive", chat.Messages);
                else
                {
                    chat = new Chat(client);
                    await _context.Chats.AddAsync(chat);
                    await _context.SaveChangesAsync();
                }
            }
        }
        await base.OnConnectedAsync();
    }
}

public class UserIdProvider : IUserIdProvider
{
    public virtual string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst("id")?.Value;
    }
}
