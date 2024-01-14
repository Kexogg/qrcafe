using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;
[PrimaryKey(nameof(Id))]
public class ChatMessage
{
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id;
        
        public string Text { get; set; }
        
        public TimeOnly TimeStamp { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Chat Chat { get; set; }
}