namespace QrCafe.Models;

public class ChatMessage
{
        public string Text { get; set; }
        
        public Guid? ClientId{ get; set; }
        
        public Chat Chat { get; set; }
}