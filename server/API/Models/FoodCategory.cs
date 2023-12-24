using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    public virtual Food Food { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;

    public virtual Restaurant Restaurant { get; set; } = null!;
}