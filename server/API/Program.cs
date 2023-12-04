using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using QrCafe;
using QrCafe.Models;


var builder = WebApplication.CreateBuilder(args);
string connection = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Host=kexogg.ru;Port=61433;Database=QR_Cafe;Username=kexogg;Password=3k3s38Ku7MPFgT5MAmbQ8TdwLJ2ZHfxZ2w3VYa7tonkCt9q6nPTYtQEiNhF3y7GTsgYZw2auhwX5UBEXLjSABMtkJX9g6E9funQnHBdREohELQYp8JYuD6cKkh2Yr4zk";

builder.Services.AddDbContext<QrCafeDbContext>(options => options.UseNpgsql(connection));

var app = builder.Build();

app.MapGet("/api/clients", async (QrCafeDbContext db) =>
{
    var clientsList = await db.Clients.Select(c=> new ClientDTO(c)).ToListAsync();
    return clientsList.Count != 0 ? Results.Json(clientsList) : Results.NotFound("Клиенты не найдены");
});
app.MapPost("/api/clients", async (string name, Guid employeeId, int tableId, int restaurantId, QrCafeDbContext db) =>
{   
    await db.Clients.AddAsync(new Client(new ClientDTO(name, employeeId, tableId, restaurantId)));
    await db.SaveChangesAsync();
    return Results.Ok("Клиент добавлен");
});


app.MapGet("/api/restaurants/{id:int}/food", async (int id, QrCafeDbContext db) =>
{
    return await db.Foods.Where(f => f.RestaurantId == id && f.IsAvailable).Select(f => new FoodDTO(f)).ToListAsync();
});

app.MapGet("/api/restaurants", async (QrCafeDbContext db) => await db.Restaurants.ToListAsync());

//Если используешь Results, то все возвращаемые значения метода должны быть в Results
app.MapGet("/api/restaurants/{id:int}/tables",  (int id, QrCafeDbContext db) =>
{
    var restaurant = db.Restaurants.FirstOrDefault(r => r.Id == id);
    if (restaurant == null) return Results.NotFound("Ресторана не существует");
    var tables = restaurant.Tables;
    return tables.Count == 0 ? Results.NoContent() : Results.Json(tables.Select(t=>new TableDTO(t)));
});

app.MapPut("/api/restaurants/{id:int}/tables/{num:int}", async (int id, int num, QrCafeDbContext db) =>
{
    var table = db.Tables.FirstOrDefault(table => table.Num == num && table.RestaurantId == id);
    if (table == null) return Results.NotFound("Столика не существует");
    if (table.AssignedEmployeeId != null) return Results.BadRequest(new { message = "Столик уже занят" });
    var employee = Table.AssignEmployee(db, table);
    table.AssignedEmployee = employee;
    table.AssignedEmployeeId = employee.Id;
    await db.SaveChangesAsync();
    return Results.Json(new EmployeeDTO(employee));
});
app.Run();