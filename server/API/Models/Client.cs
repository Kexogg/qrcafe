namespace QrCafe.Models;

public class ClientDTO
{
    public ClientDTO(string name, Guid employeeId, int tableId, int restaurantId)
    {
        Name = name;
        AssignedEmployeeId = employeeId;
        TableId = tableId;
        RestaurantId = restaurantId;
        IsActive = true;
    }
    public ClientDTO(Client client)
    {
        TableId = client.TableId;
        RestaurantId = client.RestaurantId;
        Id = client.Id;
        Name = client.Name;
        IsActive = client.IsActive;
        AssignedEmployeeId = client.AssignedEmployeeId;
        PaymentType = client.PaymentType;
        Discount = client.Discount;
        PaymentStatus = client.PaymentStatus;
        Tip = client.Tip;
        Total = client.Total;
        PaymentMethod = client.PaymentMethod;
    }

    public int TableId { get; set; }

    public int RestaurantId { get; set; }
    
    public Guid? Id { get; set; }

    public string? Name { get; set; }

    public bool IsActive { get; set; }

    public Guid AssignedEmployeeId { get; set; }

    public short? PaymentType { get; set; }

    public double? Discount { get; set; }

    public short? PaymentStatus { get; set; }

    public double? Tip { get; set; }

    public double? Total { get; set; }

    public short? PaymentMethod { get; set; }
    
}
public partial class Client
{
    public Client(ClientDTO client)
    {
        TableId = client.TableId;
        RestaurantId = client.RestaurantId;
        Id = client.Id.HasValue ? client.Id.Value : new Guid();
        Name = client.Name;
        IsActive = client.IsActive;
        AssignedEmployeeId = client.AssignedEmployeeId;
        PaymentType = client.PaymentType;
        Discount = client.Discount;
        PaymentStatus = client.PaymentStatus;
        Tip = client.Tip;
        Total = client.Total;
        PaymentMethod = client.PaymentMethod;
    }
    public int TableId { get; set; }

    public int RestaurantId { get; set; }

    public Guid Id { get; set; }

    public string? Name { get; set; }

    public bool IsActive { get; set; }

    public Guid AssignedEmployeeId { get; set; }

    public short? PaymentType { get; set; }

    public double? Discount { get; set; }

    public short? PaymentStatus { get; set; }

    public double? Tip { get; set; }

    public double? Total { get; set; }

    public short? PaymentMethod { get; set; }

    public virtual Employee AssignedEmployee { get; set; } = null!;

    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    public virtual Restaurant Restaurant { get; set; } = null!;
}
