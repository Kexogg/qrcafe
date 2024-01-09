using System.ComponentModel.DataAnnotations.Schema;

namespace QrCafe.Models;

public class ExtraDTO
{
    public ExtraDTO(){}
    
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    public int Price { get; set; }
}

public class Extra
{
    public Extra(){}
    
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int RestaurantId { get; set; }
    
    public string Name { get; set; }
    
    public int Price { get; set; }

    public ICollection<FoodExtra> FoodExtras { get; set; } = new List<FoodExtra>();

    public Restaurant? Restaurant { get; set; } = null!;
}