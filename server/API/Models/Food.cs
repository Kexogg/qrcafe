using System.ComponentModel.DataAnnotations.Schema;
using Amazon.S3;

namespace QrCafe.Models;

public class FoodDTO
{
    public FoodDTO(){}

/*
    public FoodDTO(string name, string description, int price, int weight)
    {
        Name = name;
        Description = description;
        Weight = weight;
        Price = price;
    }
*/
    public FoodDTO(Food food)
    {
        Id = food.Id;
        RestaurantId = food.RestaurantId;
        Available = food.Available;
        Name = food.Name;
        Description = food.Description;
        Weight = food.Weight;
        Price = food.Price;
        ImageUrl = $"https://s3.stk8s.66bit.ru/nyashdev/food/{food.Id}";
    }
    public int? Id { get; set; }

    public int? RestaurantId { get; set; }

    public bool Available { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Weight { get; set; }
    
    public int Price { get; set; }
    
    public List<int>? ExtrasId { get; set; } = new();
    
    public List<ExtraDTO>? Extras { get; set; } = new();
    
    public string? ImageUrl { get; set; } 
}
public partial class Food
{
    public Food(){}

    public Food(FoodDTO foodDto)
    {
        Available = foodDto.Available;
        Name = foodDto.Name;
        Description = foodDto.Description;
        Weight = foodDto.Weight;
        Price = foodDto.Price;
    }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public bool Available { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Weight { get; set; }

    public int Price { get; set; }

    public virtual ICollection<FoodExtra> FoodExtras { get; set; } = new List<FoodExtra>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant? Restaurant { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();
    
}
