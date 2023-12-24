namespace QrCafe.Models;

public class CategoryDTO
{
    public CategoryDTO(){}

    public CategoryDTO(int order, bool separate, string name, string description)
    {
        Order = order;
        Separate = separate;
        Name = name;
        Description = description;
    }

    public CategoryDTO(Category category)
    {
        Id = category.Id;
        RestaurantId = category.Id;
        Order = category.Order;
        Separate = category.Separate;
        Name = category.Name;
        Description = category.Description;
    }

    public int? Id { get; set; }

    public int? RestaurantId { get; set; }

    public int Order { get; set; }

    public bool Separate { get; set; }

    public string Name { get; set; }
    
    public string Description { get; set; }

    public List<FoodDTO>? foodList { get; set; } = new();
}
public partial class Category
{
    public Category(){}

    public Category(CategoryDTO categoryDto, int restaurantId, int id)
    {
        Id = id;
        RestaurantId = restaurantId;
        Order = categoryDto.Order;
        Separate = categoryDto.Separate;
        Name = categoryDto.Name;
        Description = categoryDto.Description;
    }
    
    public int Id;
    
    public int RestaurantId;

    public int Order;

    public bool Separate;

    public string Name = null!;
    
    public string Description = null!;

    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();

    public virtual Restaurant Restaurant { get; set; } = null!;
}