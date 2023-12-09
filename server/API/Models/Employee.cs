namespace QrCafe.Models;

public class EmployeeDTO
{
    public EmployeeDTO(Employee employee)
    {
        Id = employee.Id;
        FullName = employee.FullName;
        RoleId = employee.RoleId;
        RestaurantId = employee.RestaurantId;
        Available = employee.Available;
    }
    public Guid Id { get; set; }

    public string FullName { get; set; }

    public int RoleId { get; set; }

    public int? RestaurantId { get; set; }

    public bool Available { get; set; }
}
public partial class Employee
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = null!;

    public int RoleId { get; set; }

    public int? RestaurantId { get; set; }

    public bool Available { get; set; }

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual Restaurant? Restaurant { get; set; }

    public virtual ICollection<Table> Tables { get; set; }
}
