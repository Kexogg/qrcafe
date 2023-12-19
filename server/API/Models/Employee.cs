namespace QrCafe.Models;

public class EmployeeDTO
{
    public EmployeeDTO(){}

    public EmployeeDTO(string login, string password)
    {
        Login = login;
        Password = password;
    }
    public EmployeeDTO(string fullName, string login, string password, int roleId)
    {
        FullName = fullName;
        Login = login;
        Password = password;
        RoleId = roleId;
        Available = true;
    }
    public EmployeeDTO(Employee employee)
    {
        Id = employee.Id;
        FullName = employee.FullName;
        RoleId = employee.RoleId;
        RestaurantId = employee.RestaurantId;
        Available = employee.Available;
    }
    public Guid? Id { get; set; }

    public string FullName { get; set; }

    public string Login { get; set; }
    
    public string Password { get; set; }
    public int RoleId { get; set; }

    public int? RestaurantId { get; set; }

    public bool Available { get; set; }
}
public partial class Employee
{
    public Employee(){}

    public Employee(EmployeeDTO employeeDto, int restId)
    {
        Id = employeeDto.Id ?? Guid.NewGuid();
        FullName = employeeDto.FullName;
        Login = employeeDto.Login;
        Password = employeeDto.Password;
        RoleId = employeeDto.RoleId;
        RestaurantId = employeeDto.RestaurantId ?? restId;
        Available = true;
    }
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
