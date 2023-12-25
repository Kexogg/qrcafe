using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QrCafe;
using QrCafe.Models;



var builder = WebApplication.CreateBuilder(args);
string connection = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Host=kexogg.ru;Port=61433;Database=QR_Cafe;Username=kexogg;Password=3k3s38Ku7MPFgT5MAmbQ8TdwLJ2ZHfxZ2w3VYa7tonkCt9q6nPTYtQEiNhF3y7GTsgYZw2auhwX5UBEXLjSABMtkJX9g6E9funQnHBdREohELQYp8JYuD6cKkh2Yr4zk";

builder.Services.AddDbContext<QrCafeDbContext>(options => options.UseNpgsql(connection));

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = AuthOptions.ISSUER,
            ValidateAudience = true,
            ValidAudience = AuthOptions.AUDIENCE,
            ValidateLifetime = true,
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            ValidateIssuerSigningKey = true
        };
    });

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/restaurants/{restId:int}/login", (EmployeeDTO employeeLoginData, int restId, QrCafeDbContext db) =>
{
        var restaurant = db.Restaurants.Include(r=> r.Employees).FirstOrDefault(r => r.Id == restId);
        if (restaurant == null) return Results.BadRequest(new { message = "Ресторана не существует" });
        var employee = restaurant.Employees.FirstOrDefault(e =>
            e.Login == employeeLoginData.Login && e.Password == employeeLoginData.Password);
        if (employee == null) return Results.Unauthorized();
        var claims = new List<Claim> { new(ClaimTypes.Name, employee.Login) };
        var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(1)),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
        string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
        var response = new
        {
            access_token = encodedJwt
        };
        return Results.Json(response, statusCode: 200);
    
});

app.MapGet("/api/clients", [Authorize] async (QrCafeDbContext db) =>
{
    var clientsList = await db.Clients.Select(c=> new ClientDTO(c)).ToListAsync();
    return clientsList.Count != 0 ? Results.Json(clientsList) : Results.NotFound(new{message = "Клиенты не найдены"});
});

app.MapPut("/api/restaurants/{restId:int}/tables/{tableNum:int}", 
    async ([FromBody] ClientDTO clientDto, int tableNum, int restId, QrCafeDbContext db) =>
    {
        var restaurant = db.Restaurants.Include(restaurant => restaurant.Tables)
            .FirstOrDefault(r => r.Id == restId);
        if (restaurant == null) return Results.NotFound(new { message = "Ресторана не существует" });
        var table = restaurant.Tables.FirstOrDefault(t => t.Num == tableNum);
        if (table == null) return Results.BadRequest("Столика не существует");
        if (table.AssignedEmployeeId != null) return Results.BadRequest(new { message = "Столик уже занят" });
        var employee = Table.AssignEmployee(db, table);
        table.AssignedEmployee = employee;
        table.AssignedEmployeeId = employee.Id;
        var client = new Client(clientDto, restId, tableNum, employee.Id);
        await db.Clients.AddAsync(client);
        await db.SaveChangesAsync();
        return Results.Json(new ClientDTO(client));
    });

app.MapPost("/api/restaurants/{restId:int}/categories", 
    [Authorize] async ([FromBody]CategoryDTO categoryDto, int restId, QrCafeDbContext db) => 
    {
        var restaurant = await db.Restaurants.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
        if (restaurant == null) return Results.NotFound("Ресторана не существует");
        if (restaurant.Categories.FirstOrDefault(c => c.Order == categoryDto.Order) != null) 
            return Results.Conflict(new{message = "Категория с таким номером уже существует"});
        var random = new Random();
        var id = random.Next(1, int.MaxValue);
        while (restaurant.Categories.FirstOrDefault(c => c.Id == id) != null) id = random.Next(1, int.MaxValue);
        var category = new Category(categoryDto, restId, id);
        categoryDto.Id = id;
        categoryDto.RestaurantId = restId;
        await db.Categories.AddAsync(category);
        await db.SaveChangesAsync();
        return Results.Json(categoryDto);
    });

app.MapPost("/api/restaurants/{restId:int}/food", [Authorize] async ([FromBody]FoodDTO foodDto, int restId, QrCafeDbContext db) =>
{
    var restaurant = await db.Restaurants.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
    if (restaurant == null) return Results.NotFound("Ресторана не существует");
    var random = new Random();
    var id = random.Next(1, int.MaxValue);
    while (restaurant.Categories.FirstOrDefault(c => c.Id == id) != null) id = random.Next(1, int.MaxValue);
    var food = new Food(foodDto, id, restId);
    foodDto.Id = id;
    foodDto.RestaurantId = restId;
    await db.Foods.AddAsync(food);
    await db.SaveChangesAsync();
    return Results.Json(foodDto);
});

app.MapGet("/api/restaurants/{restId:int}/food", async (int restId, QrCafeDbContext db) =>
{
    var restaurant = await db.Restaurants.Include(restaurant => restaurant.Categories)
        .ThenInclude(c=> c.FoodCategories).ThenInclude(fc=> fc.Food)
        .FirstOrDefaultAsync(r => r.Id == restId);
    if (restaurant == null) return Results.NotFound("Ресторана не существует");
    var result = new List<CategoryDTO>();
    foreach (var category in restaurant.Categories)
    {
        var categoryDTO = new CategoryDTO(category);
        foreach (var foodCategory in category.FoodCategories)
        {
            categoryDTO.foodList.Add(new FoodDTO(foodCategory.Food));
        }
        result.Add(categoryDTO);
    }
    return Results.Json(result);
});

app.MapPost("/api/restaurants/{restId:int}/table/{tableNum:int}/queue", 
    async ([FromBody]List<Food> foodList,int restId, int tableNum, QrCafeDbContext db) =>
{
    var restaurant = await db.Restaurants.Include(r => r.Clients)
        .FirstOrDefaultAsync(r => r.Id == restId);
    if (restaurant == null) return Results.NotFound(new{ message = "Ресторана не существует" });
    var client = restaurant.Clients.FirstOrDefault(c=>c.TableId == tableNum);
    var time = TimeOnly.FromDateTime(DateTime.Now);
    var queue = new List<FoodQueueDTO>();
    foreach (var foodQueue in foodList.Select(food => new FoodQueue(food, client.Id, Guid.NewGuid(), time)))
    {
        queue.Add(new FoodQueueDTO(foodQueue));
        await db.FoodQueues.AddAsync(foodQueue);
    }

    await db.SaveChangesAsync();
    return Results.Json(queue);
});

app.MapPut("/api/restaurants/{restId:int}/queue", 
    [Authorize] async ([FromBody]FoodQueue foodQueue, int restId, QrCafeDbContext db) =>
    {
        var order = await db.FoodQueues
            .FirstOrDefaultAsync(o => o.RestaurantId == restId && o.Id == foodQueue.Id);
        if (order == null) return Results.NotFound(new {message ="Заказа не существует"});
        order.State = foodQueue.State;
        await db.SaveChangesAsync();
        return Results.Ok();
    });

app.MapPost("/api/organizations/{orgId:int}/restaurants", 
    [Authorize] async ([FromBody]RestaurantDTO restaurantDto, int orgId, QrCafeDbContext db) =>
{
    var organization = db.Organizations.FirstOrDefault(o => o.Id == orgId);
    if (organization == null) return Results.BadRequest("Организации не существует");
    var random = new Random();
    var restId = random.Next(10000, 100000);
    while (db.Restaurants.Where(r=> r.OrgId ==orgId).FirstOrDefault(r=>r.Id == restId)!=null)
    {
        restId = random.Next(10000, 100000);
    }
    var restaurant = new Restaurant(restaurantDto, restId, orgId);
    await db.Restaurants.AddAsync(restaurant);
    await db.SaveChangesAsync();
    return Results.Json(new RestaurantDTO(restaurant));
});

app.MapPost("/api/restaurants/{restId:int}/categories/{catId:int}/food", 
    [Authorize] async (List<int> foodIdList, int restId, int catId,QrCafeDbContext db) =>
    {
        var restaurant = await db.Restaurants.Include(r => r.Foods)
            .Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
        if (restaurant == null) return Results.NotFound(new { message = "Ресторан не найден" });
        var addedFood = new List<FoodDTO>();
        foreach (var foodId in foodIdList)
        {
            var food = restaurant.Foods.FirstOrDefault(f => f.Id == foodId);
            if (food == null) continue;
            var foodCategory = new FoodCategory(foodId, catId, restId);
            await db.FoodCategories.AddAsync(foodCategory);
            addedFood.Add(new FoodDTO(food));
        }
        
        await db.SaveChangesAsync();
        return Results.Json(addedFood);
    });

app.MapPost("/api/restaurants/{restId:int}/categories/food/{foodId:int}", 
    [Authorize] async (List<int> categoriesIdList, int restId, int foodId,QrCafeDbContext db) =>
    {
        var restaurant = await db.Restaurants.Include(r => r.Foods)
            .Include(r => r.Categories).FirstOrDefaultAsync(r=> r.Id == restId);
        if (restaurant == null) return Results.NotFound(new { message = "Ресторан не найден" });
        var addedCategories = new List<CategoryDTO>();
        foreach (var categoryId in categoriesIdList)
        {
            var category = restaurant.Categories.FirstOrDefault(c => c.Id == categoryId);
            if (category == null) continue;
            var foodCategory = new FoodCategory(foodId, categoryId, restId);
            addedCategories.Add(new CategoryDTO(category));
            await db.FoodCategories.AddAsync(foodCategory);
        }

        await db.SaveChangesAsync();
        return Results.Json(addedCategories);
    });

app.MapGet("/api/organizations/{orgId:int}/restaurants", [Authorize] async (int orgId, QrCafeDbContext db) =>
{
    var organization = await db.Organizations.Include(o=>o.Restaurants).FirstOrDefaultAsync(o => o.Id == orgId);
    if (organization == null) return Results.BadRequest("Организации не существует");
    var restaurants =organization.Restaurants.Select(r => new RestaurantDTO(r)).ToList();
    return Results.Json(restaurants);
});

app.MapGet("/api/restaurants/{restId:int}/tables",  [Authorize] (int restId, QrCafeDbContext db) =>
{
    var restaurant = db.Restaurants.Include(restaurant => restaurant.Tables).FirstOrDefault(r => r.Id == restId);
    if (restaurant == null) return Results.NotFound("Ресторана не существует");
    var tables = restaurant.Tables;
    return tables.Count == 0 ? Results.NoContent() : Results.Json(tables.Select(t=>new TableDTO(t)));
});

app.MapPost("/api/restaurants/{restId:int}/tables", [Authorize] async (int restId, QrCafeDbContext db) =>
{
    var restaurant = db.Restaurants.Include(r=> r.Tables).FirstOrDefault(r=> r.Id == restId);
    if (restaurant == null) return Results.NotFound(new {message = "Ресторан не найден"});
    var table = new Table{Num = restaurant.Tables.Count+1, RestaurantId = restId};
    await db.Tables.AddAsync(table);
    await db.SaveChangesAsync();
    return Results.Json(new TableDTO(table));
});

app.MapPost("/api/organizations", [Authorize] async ([FromBody]OrganizationDTO organizationDto, QrCafeDbContext db) =>
{
    var random = new Random();
    var orgId = random.Next(10000, 21473);
    while (db.Organizations.FirstOrDefault(r=>r.Id == orgId)!=null)
    {
        orgId = random.Next(10000, 21473);
    }
    var organization = new Organization(organizationDto, orgId);
    await db.Organizations.AddAsync(organization);
    await db.SaveChangesAsync();
    return Results.Json(new OrganizationDTO(organization));
});

app.MapPost("/api/restaurants/{restId:int}/employees", 
    [Authorize] async ([FromBody]EmployeeDTO employeeDto, int restId, QrCafeDbContext db) =>
{
    var restaurant = db.Restaurants.Include(r=> r.Employees).FirstOrDefault(r => r.Id == restId);
    if (restaurant == null) return Results.BadRequest(new{message = "Ресторана не существует"});
    if (restaurant.Employees.FirstOrDefault(e => e.Login == employeeDto.Login) != null) return Results.Conflict(new{message = "Пользователь с таким логином уже существует"});
    var employee = new Employee(employeeDto, restId);
    await db.Employees.AddAsync(employee);
    await db.SaveChangesAsync();
    return Results.Json(new EmployeeDTO(employee));
});
app.Run();

public class AuthOptions
{
    public const string ISSUER = "Server"; // издатель токена
    public const string AUDIENCE = "Employee"; // потребитель токена
    const string KEY = "VSADKDHDALDUUAHHSHDHADH";   // ключ для шифрации
    public static SymmetricSecurityKey GetSymmetricSecurityKey() => 
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}