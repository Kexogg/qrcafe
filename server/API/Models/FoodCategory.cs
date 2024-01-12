namespace QrCafe.Models;

public partial class FoodCategory
{
    public FoodCategory(int foodId, int categoryId, int restaurantId)
    {
        FoodId = foodId;
        CategoryId = categoryId;
        RestaurantId = restaurantId;
    }
        
    public int FoodId;
    
    public int CategoryId;

    public int RestaurantId;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Food Food { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Category Category { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant Restaurant { get; set; } = null!;
}