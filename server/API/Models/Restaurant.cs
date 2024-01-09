using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

public class RestaurantDTO
{
    public RestaurantDTO(){}
    public RestaurantDTO(string name, string address)
    {
        Name = name;
        Address = address;
    }
    public RestaurantDTO(Restaurant restaurant)
    {
        Id = restaurant.Id;
        Name = restaurant.Name;
        Address = restaurant.Address;
    }

    public int? Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;
    
}
public partial class Restaurant
{
    public Restaurant(){}

    public Restaurant(RestaurantDTO restaurantDto, int restId, int orgId)
    {
        Id = orgId*100000+restId;
        Name = restaurantDto.Name;
        Address = restaurantDto.Address;
        OrgId = orgId;
    }
    
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public int OrgId { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Organization Org { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodCategory> FoodCategories { get; set; } = new List<FoodCategory>();
    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<Extra> Extras { get; set; } = new List<Extra>();
    
    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodExtra> FoodExtras { get; set; } = new List<FoodExtra>();
}
