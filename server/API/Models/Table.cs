using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

public class TableDTO
{
    public TableDTO(Table table)
    {
        Id = table.Id;
        Name = table.Name;
        AssignedEmployee = table.AssignedEmployee == null ? null : new EmployeeDTO(table.AssignedEmployee);
        Client = table.Client == null ? null : new ClientDTO(table.Client);
    }
    
    public int Id { get; set; }

    public string Name { get; set; }

    public EmployeeDTO? AssignedEmployee { get; set; }
    
    public ClientDTO? Client { get; set; }
}
public partial class Table
{
    public Table(){}
    
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    public int Id { get; set; }
    
    public string Name { get; set; }

    public int RestaurantId { get; set; }

    public Guid? ClientId { get; set; }
    
    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Client? Client { get; set; }
    
    public Guid? AssignedEmployeeId { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Employee? AssignedEmployee { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant? Restaurant { get; set; } = null!;
    
    public static Employee AssignEmployee(QrCafeDbContext db, Table table)
    {
        var tables = db.Tables.Include(t=> t.AssignedEmployee).Where(t => t.RestaurantId == table.RestaurantId).ToListAsync().Result;
        var availableEmployees = db.Employees
            .Where(e => e.RestaurantId == table.RestaurantId && e.Available && e.Role == 1)
            .ToDictionary(employee => employee, _ => 0);
        if (availableEmployees.Count == 0) return null;
        foreach (var tabl in tables.Where(tabl => tabl.AssignedEmployee != null
                                                  && tabl.AssignedEmployee.Role != 0))
        {
            availableEmployees[availableEmployees.Keys.FirstOrDefault(employee => employee.Id==tabl.AssignedEmployeeId)] += 1;
        }
        var employeeToAssign = availableEmployees.First(x=>x.Value==availableEmployees.Values.Min()).Key;
        return employeeToAssign;
    }
}
