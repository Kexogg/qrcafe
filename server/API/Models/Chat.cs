using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

public class Chat
{
    public Chat(){}
    public Chat(Client client)
    {
        Client = client;
        Id = client.Id;
        RestaurantId = client.RestaurantId;
    }

    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    
    public Guid Id { get; set; }
    
    [DeleteBehavior(DeleteBehavior.ClientCascade)]
    public Client Client { get; set; }

    public int RestaurantId { get; set; }
    
    public Restaurant Restaurant { get; set; }
}