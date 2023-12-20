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

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();

    public virtual Organization Org { get; set; } = null!;

    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
}
