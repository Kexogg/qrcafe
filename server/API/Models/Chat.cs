using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

[PrimaryKey(nameof(RestId),nameof(ClientId))]
public class Chat
{
    public int RestId { get; set; }
    
    public Guid ClientId { get; set; }

    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();

    public Client Client { get; set; }

    public Restaurant Restaurant { get; set; }
}