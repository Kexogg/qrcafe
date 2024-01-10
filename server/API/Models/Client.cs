using System.ComponentModel.DataAnnotations.Schema;

namespace QrCafe.Models;

public class ClientDTO
{
    public ClientDTO(){}

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
        FoodQueue = client.FoodQueues.Select(fq => new FoodQueueDTO(fq)).ToList();
    }

    public int TableId { get; set; }

    public int RestaurantId { get; set; }
    
    public Guid? Id { get; set; }

    public string? Name { get; set; }

    public bool IsActive { get; set; }

    public Guid? AssignedEmployeeId { get; set; }

    public short? PaymentType { get; set; }

    public double? Discount { get; set; }

    public short? PaymentStatus { get; set; }

    public double? Tip { get; set; }

    public double? Total { get; set; }

    public short? PaymentMethod { get; set; }

    public ICollection<FoodQueueDTO> FoodQueue = new List<FoodQueueDTO>();

}
public partial class Client
{
    public Client()
    {
    }

    public Client( int restId, int tableNum, Guid assignedEmployeeId)
    {
        RestaurantId = restId;
        TableId = tableNum;
        AssignedEmployeeId = assignedEmployeeId;
        IsActive = true;
    }
    public Client(ClientDTO client)
    {
        TableId = client.TableId;
        RestaurantId = client.RestaurantId;
        Id = client.Id ?? new Guid();
        Name = client.Name;
        IsActive = client.IsActive;
        AssignedEmployeeId = (Guid)client.AssignedEmployeeId;
        PaymentType = client.PaymentType;
        Discount = client.Discount;
        PaymentStatus = client.PaymentStatus;
        Tip = client.Tip;
        Total = client.Total;
        PaymentMethod = client.PaymentMethod;
    }
    public int TableId { get; set; }

    public int RestaurantId { get; set; }
    
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Table Table { get; set; } = null!;
    
    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Employee AssignedEmployee { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual ICollection<FoodQueue> FoodQueues { get; set; } = new List<FoodQueue>();

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant Restaurant { get; set; } = null!;
}
