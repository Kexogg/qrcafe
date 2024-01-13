﻿using System.ComponentModel.DataAnnotations.Schema;

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
        Available = category.Available;
    }

    public int? Id { get; set; }

    public int? RestaurantId { get; set; }
    
    public int Order { get; set; }

    public bool Separate { get; set; }

    public string Name { get; set; }
    
    public string Description { get; set; }
    
    public bool Available { get; set; }
    
    public List<FoodDTO>? FoodList { get; set; } = new();
    
    public List<int>? FoodIdList { get; set; } 
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
        Available = categoryDto.Available;
    }
    
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int RestaurantId { get; set; }

    public int Order { get; set; }

    public bool Separate { get; set; }

    public string? Name { get; set; }
    
    public string? Description { get; set; }
    
    public bool Available { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant? Restaurant { get; set; } = null!;
}