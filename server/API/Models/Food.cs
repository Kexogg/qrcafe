namespace QrCafe.Models;

public class FoodDTO
{
    public FoodDTO(Food food)
    {
        Id = food.Id;
        RestaurantId = food.RestaurantId;
        IsAvailable = food.IsAvailable;
        Name = food.Name;
        Description = food.Description;
        Price = food.Price;
    }
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public bool IsAvailable { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Price { get; set; }
}
public partial class Food
{
    public int Id { get; set; }

    public int RestaurantId { get; set; }

    public bool IsAvailable { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Price { get; set; }

    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    public virtual Restaurant Restaurant { get; set; } = null!;
}
