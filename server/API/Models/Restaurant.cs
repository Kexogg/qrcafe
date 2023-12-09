using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

public class RestaurantDTO
{
    public RestaurantDTO(Restaurant restaurant)
    {
        Id = restaurant.Id;
        Name = restaurant.Name;
        Address = restaurant.Address;
        OrgFullName = restaurant.Org.FullName;
    }
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string OrgFullName { get; set; }
}
public partial class Restaurant
{
    public Restaurant(){}

    public Restaurant(string name, string address, Organization org)
    {
        Id = org.Restaurants.Count;
        Name = name;
        Address = address;
        OrgId = org.Id;
    }
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public int OrgId { get; set; }

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual ICollection<Employee> Employees { get; set; }

    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();

    public virtual Organization Org { get; set; } = null!;

    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}
