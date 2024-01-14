using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using QrCafe.Models;

namespace QrCafe;

[Authorize]
public class ChatController : Hub
{
    public async Task Send([FromBody] ChatMessage message)
    {
        var role = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value.ToString();
        switch (role)
        {
            case "client":
            {
                if (Context.UserIdentifier is string clientId)
                {
                    var employee =
                        Context.User.Claims.FirstOrDefault(c => c.Type == "assignedEmployeeId")?.Value.ToString();

                    await Clients.All.SendAsync("Receive", message.Text);
                }

                break;
            }
            case "employee":
            {
                if (Context.UserIdentifier is string employeeId)
                {
                    await Clients.Users(employeeId, message.ClientId.ToString()).SendAsync("Receive", message.Text);
                }
                break;
            }
        }
    }
    public override async Task OnConnectedAsync()
    {
        await Clients.All.SendAsync("Notify", "Вошел в чат");
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
