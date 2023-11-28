using Microsoft.EntityFrameworkCore;

namespace QrCafe.Models;

public class TableDTO
{
    public TableDTO(Table table)
    {
        Num = table.Num;
        RestaurantId = table.RestaurantId;
        AssignedEmployeeId = table.AssignedEmployeeId;
    }
    public int Num { get; set; }

    public Guid RestaurantId { get; set; }

    public Guid? AssignedEmployeeId { get; set; }
}
public partial class Table
{
    public int Num { get; set; }

    public Guid RestaurantId { get; set; }

    public Guid? AssignedEmployeeId { get; set; }

    public virtual Employee? AssignedEmployee
    {
        get; set;
    }

    public virtual Restaurant Restaurant { get; set; } = null!;
    
    public static Employee AssignEmployee(QrCafeDbContext db, Table table)
    {
        var tables = db.Tables.Where(t => t.RestaurantId == table.RestaurantId).ToListAsync().Result;
        var availableEmployees = db.Employees.Where(e => e.RestaurantId == table.RestaurantId && e.Available).ToDictionary(employee => employee, _ => 0);
        foreach (var tabl in tables.Where(tabl => tabl.AssignedEmployeeId != null))
        {
            availableEmployees[availableEmployees.Keys.FirstOrDefault(employee => employee.Id==tabl.AssignedEmployeeId)] += 1;
        }
        var employeeToAssign = availableEmployees.First(x=>x.Value==availableEmployees.Values.Min()).Key;
        return employeeToAssign;
    }
}
