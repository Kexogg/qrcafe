using System.ComponentModel.DataAnnotations.Schema;

namespace QrCafe.Models;

public class CategoryDTO
{
    public CategoryDTO(){}

    public CategoryDTO(Category category)
    {
        Id = category.Id;
        Order = category.Order;
        Separate = category.Separate;
        Name = category.Name;
        Description = category.Description;
    }

    public int? Id { get; set; } = null!;
    
    public int Order { get; set; }

    public bool Separate { get; set; }

    public string Name { get; set; }
    
    public string Description { get; set; }

    public List<FoodDTO>? foodList { get; set; } = new();
}
public partial class Category
{
    public Category(){}

    public Category(CategoryDTO categoryDto)
    {
        Order = categoryDto.Order;
        Separate = categoryDto.Separate;
        Name = categoryDto.Name;
        Description = categoryDto.Description;
    }
    
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int RestaurantId { get; set; }

    public int Order { get; set; }

    public bool Separate { get; set; }

    public string? Name { get; set; }
    
    public string? Description { get; set; }

    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();

    public virtual Restaurant? Restaurant { get; set; } = null!;
}