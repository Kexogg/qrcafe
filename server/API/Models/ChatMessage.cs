using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;
[PrimaryKey(nameof(Id))]
public class ChatMessage
{
        public ChatMessage(string text, Guid chatId, int senderNum)
        {
                Text = text;
                TimeStamp = TimeOnly.FromDateTime(DateTime.Now);
                ChatId = chatId;
                SenderNum = senderNum;
        }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id;
        
        public string Text { get; set; }
        
        public int SenderNum { get; set; }
        
        public TimeOnly TimeStamp { get; set; }
        
        public Guid ChatId { get; set; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        [DeleteBehavior(DeleteBehavior.ClientCascade)]
        public Chat Chat { get; set; }
}