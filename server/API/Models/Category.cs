namespace QrCafe.Models;

public partial class Category
{
    public int Id;
    
    public int RestaurantId;

    public int Num;

    public bool Separate;

    public string Name = null!;
    
    public string Description = null!;

    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();

    public virtual Restaurant Restaurant { get; set; } = null!;
}