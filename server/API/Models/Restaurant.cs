using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

public class RestaurantDTO
{
    public RestaurantDTO(Restaurant restaurant)
    {
        Id = restaurant.Id;
        Name = restaurant.Name;
        Address = restaurant.Address;
        OrgId = restaurant.OrgId;
    }
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public Guid OrgId { get; set; }
}
public partial class Restaurant
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public Guid OrgId { get; set; }

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual ICollection<Employee> Employees { get; set; }

    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();

    public virtual Organization Org { get; set; } = null!;

    public virtual ICollection<Table> Tables
    {
        get
        {
            var db = new QrCafeDbContext();
            return db.Tables.Where(t => t.RestaurantId == Id).ToListAsync().Result;
        }
        set{}
    }

}
