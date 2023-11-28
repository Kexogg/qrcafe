using Microsoft.EntityFrameworkCore;
using QrCafe;
using QrCafe.Models;


var builder = WebApplication.CreateBuilder(args);
string connection =
    "Host=kexogg.ru;Port=61433;Database=QR_Cafe;Username=kexogg;Password=3k3s38Ku7MPFgT5MAmbQ8TdwLJ2ZHfxZ2w3VYa7tonkCt9q6nPTYtQEiNhF3y7GTsgYZw2auhwX5UBEXLjSABMtkJX9g6E9funQnHBdREohELQYp8JYuD6cKkh2Yr4zk";

builder.Services.AddDbContext<QrCafeDbContext>(options => options.UseNpgsql(connection));

var app = builder.Build();

app.MapGet("/api/clients", async (QrCafeDbContext db) => await db.Clients.Select(c=>new ClientDTO(c)).ToListAsync());

app.MapPost("/api/clients", async (Client client, QrCafeDbContext db) =>
{
    await db.Clients.AddAsync(client);
    await db.SaveChangesAsync();
    return client;
});
app.MapGet("/api/restaurants/{id:guid}/food", async (Guid id, QrCafeDbContext db) =>
{
    return await db.Foods.Where(f => f.RestaurantId == id).Select(f => new FoodDTO(f)).ToListAsync();
});
app.MapGet("/api/restaurants", async (QrCafeDbContext db) => await db.Restaurants.ToListAsync());
app.MapGet("/api/restaurants/{id:guid}/tables", (QrCafeDbContext db, Guid id) =>
{
    var tables = db.Tables.Where(t=>t.RestaurantId==id).Select(t=>new TableDTO(t)).ToListAsync();
    return tables.Result;
});
app.MapPost("/api/restaurants/{id:guid}/tables/{num:int}", async (Guid id, int num, QrCafeDbContext db) =>
{
    var table = db.Tables.FirstOrDefault(table => table.Num == num && table.RestaurantId == id);
    if (table.AssignedEmployeeId != null) return Results.NotFound(new { message = "Столик уже занят" });
    var employee = Table.AssignEmployee(db, table);
    table.AssignedEmployee = employee;
    table.AssignedEmployeeId = employee.Id;
    await db.SaveChangesAsync();
    return Results.Json(new EmployeeDTO(employee));
});
app.Run();