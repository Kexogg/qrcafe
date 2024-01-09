namespace QrCafe.Models;

public class FoodExtra
{
    public FoodExtra(){}
    public FoodExtra(int foodId, int extraId, int restaurantId)
    {
        FoodId = foodId;
        ExtraId = extraId;
        RestaurantId = restaurantId;
    }
        
    public int FoodId;
    
    public int ExtraId;

    public int RestaurantId;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Food Food { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Extra Extra { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant Restaurant { get; set; } = null!;
}