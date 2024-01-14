using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace QrCafe;

public class Message
{
    public string Text;
    public string ClientId;
}

[Authorize]
public class Chat : Hub
{
    public async Task Send([FromBody] Message message)
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

                    await Clients.Users(employee, clientId).SendAsync("Receive", message.Text);
                }

                break;
            }
            case "employee":
            {
                if (Context.UserIdentifier is string employeeId)
                {
                    await Clients.Users(employeeId, message.ClientId).SendAsync("Receive", message.Text);
                }

                break;
            }
        }
    }
}

public class UserIdProvider : IUserIdProvider
{
    public virtual string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst("id")?.Value;
    }
}
