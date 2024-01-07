using System.ComponentModel.DataAnnotations.Schema;

namespace QrCafe.Models;

public class FoodDTO
{
    public FoodDTO(){}

    public FoodDTO(string name, string description, int price, int weight)
    {
        Name = name;
        Description = description;
        Weight = weight;
        Price = price;
    }
    public FoodDTO(Food food)
    {
        Id = food.Id;
        RestaurantId = food.RestaurantId;
        IsAvailable = food.IsAvailable;
        Name = food.Name;
        Description = food.Description;
        Weight = food.Weight;
        Price = food.Price;
    }
    public int? Id { get; set; }

    public int? RestaurantId { get; set; }

    public bool IsAvailable { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Weight { get; set; }
    
    public int Price { get; set; }
}
public partial class Food
{

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public bool IsAvailable { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Weight { get; set; }

    public int Price { get; set; }

    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    public virtual Restaurant? Restaurant { get; set; } = null!;

    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();
}
