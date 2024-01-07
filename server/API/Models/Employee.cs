namespace QrCafe.Models;


public struct EmployeeLoginData(string login, string password)
{
    public string Login { get; set; } = login;

    public string Password { get; set; } = password;
}
public class EmployeeDTO
{
    public EmployeeDTO(){}
    
    public EmployeeDTO(Employee employee)
    {
        Id = employee.Id;
        Login = employee.Login;
        FullName = employee.FullName;
        RoleId = employee.RoleId;
        Available = employee.Available;
    }
    public Guid? Id { get; set; }

    public string? FullName { get; set; }

    public string Login { get; set; }
    
    public int RoleId { get; set; }

    public bool Available { get; set; }
}
public partial class Employee
{
    public Employee(){}
    
    public Guid Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Login { get; set; }
    
    public string Password { get; set; }
    public int RoleId { get; set; }

    public int? RestaurantId { get; set; }

    public bool Available { get; set; }

    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();

    public virtual Restaurant? Restaurant { get; set; }

    public virtual ICollection<Table> Tables { get; set; }
}
