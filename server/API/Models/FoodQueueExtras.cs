namespace QrCafe.Models;

public class FoodQueueExtra
{
    public FoodQueueExtra(){}
    public FoodQueueExtra(Guid foodQueueId, int extraId, int restaurantId)
    {
        FoodQueueId = foodQueueId;
        ExtraId = extraId;
        RestaurantId = restaurantId;
    }
        
    public Guid FoodQueueId;
    
    public int ExtraId;

    public int RestaurantId;
    

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual FoodQueue FoodQueue { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Extra Extra { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant Restaurant { get; set; } = null!;
}