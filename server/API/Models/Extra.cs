using System.ComponentModel.DataAnnotations.Schema;

namespace QrCafe.Models;

public class ExtraDTO
{
    public ExtraDTO(){}

    public ExtraDTO(Extra extra)
    {
        Id = extra.Id;
        Name = extra.Name;
        Price = extra.Price;
    }
    
    public int? Id { get; set; }
    
    public string Name { get; set; }
    
    public int Price { get; set; }
}

public class Extra
{
    public Extra(){}

    public Extra(ExtraDTO extraDto)
    {
        Name = extraDto.Name;
        Price = extraDto.Price;
    }
    
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int RestaurantId { get; set; }
    
    public string Name { get; set; }
    
    public int Price { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public ICollection<FoodQueueExtra> FoodQueueExtras { get; set; } = new List<FoodQueueExtra>();
    
    [System.Text.Json.Serialization.JsonIgnore]
    public ICollection<FoodExtra> FoodExtras { get; set; } = new List<FoodExtra>();
    
    [System.Text.Json.Serialization.JsonIgnore]
    public Restaurant? Restaurant { get; set; } = null!;
}