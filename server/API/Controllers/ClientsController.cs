using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QrCafe.Models;

namespace QrCafe.Controllers;

/// <summary>
/// Контроллер для работы с клиентами
/// </summary>
[Route("api/restaurants/{restId:int}/[controller]")]
[ApiController]
public class ClientsController : ControllerBase
{
    private readonly QrCafeDbContext _context;

    /// <summary>
    /// Конструктор контроллера клиентов
    /// </summary>
    public ClientsController(QrCafeDbContext context)
    {
        _context = context;
    }

    // GET: api/restaurants/0/clients
    /// <summary>
    /// Получение списка клиентов
    /// </summary>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpGet]
    [Authorize(Roles = "employee")]
    public async Task<ActionResult<IEnumerable<ClientDTO>>> GetClients(int restId)
    {
        return await _context.Clients.Where(c=> c.RestaurantId == restId)
            .Include(c => c.FoodQueue).ThenInclude(fq => fq.FoodQueueExtras)
            .ThenInclude(fqe => fqe.Extra)
            .Include(c => c.FoodQueue)
            .ThenInclude(fq=> fq.Food)
            .Select(c => new ClientDTO(c)).ToListAsync();
    }


    /// <summary>
    /// Получить информацию о прикрепленном к клиенту сотруднике
    /// </summary>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpGet("employee")]
    [Authorize(Roles = "client")]
    public async Task<ActionResult<EmployeeDTO>> GetEmployeeInfo(int restId)
    {
            var clientIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
            var restaurantClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
            var client = await _context.Clients.Where(c => c.RestaurantId == restaurantClaim)
                .Include(c => c.AssignedEmployee)
                .FirstOrDefaultAsync(c => c.Id == clientIdClaim);
            return new EmployeeDTO(client.AssignedEmployee);
    }
    
    // GET: api/restaurants/0/clients/5
    /// <summary>
    /// Получение клиента
    /// </summary>
    /// <param name="id">ID клиента</param>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "employee")]
    public async Task<ActionResult<ClientDTO>> GetClient(Guid id, int restId)
    {
        var client = await _context.Clients.Where(c=> c.RestaurantId == restId)
            .FirstOrDefaultAsync(c=> c.Id == id);

        if (client == null)
        {
            return NotFound("Client not found");
        }

        return new ClientDTO(client);
    }
    /// <summary>
    /// Изменение параметров клиента
    /// </summary>
    /// <param name="id">ID клиента</param>
    /// <param name="client">измененный клиент</param>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "client,employee")]
    public async Task<IActionResult> PatchClient(Guid id, Client client, int restId)
    {
        if (id != client.Id)
        {
            return BadRequest("ID mismatch");
        }

        _context.Entry(client).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ClientExists(id,restId))
            {
                return NotFound("Client not found");
            }
            throw;
        }

        return NoContent();
    }
    /// <summary>
    /// Запрос изменения имени клиента
    /// </summary>
    public class ChangeClientNameRequest
    {
        /// <summary>
        /// Имя клиента
        /// </summary>
        public required string Name { get; set; }
    }
    /// <summary>
    /// Изменение имени клиента
    /// </summary>
    /// <param name="request">Тело запроса</param>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpPatch]
    [Route("name")]
    [Authorize(Roles = "client")]
    public async Task<IActionResult> ChangeClientName([FromBody] ChangeClientNameRequest request, int restId)
    {
        var clientName = request.Name;
        var clientIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
        var restaurantClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
        if (restaurantClaim != restId) return BadRequest("Restaurant ID mismatch");
        var client = await _context.Clients.Where(c => c.RestaurantId == restaurantClaim)
            .FirstOrDefaultAsync(c => c.Id == clientIdClaim);
        if (client == null) return NotFound("Client not found");
        client.Name = clientName;
        await _context.SaveChangesAsync();
        return Ok();
    }
        
    // POST: api/Clients/restaurants/0/tables/1
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    /// <summary>
    /// Бронирование стола (создание клиента)
    /// </summary>
    /// <param name="tableId">ID стола</param>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpPost("tables/{tableId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> PutClient(int restId, int tableId)
    {
        var restaurant = _context.Restaurants.Include(restaurant => restaurant.Tables)
            .FirstOrDefault(r => r.Id == restId);
        if (restaurant == null) return NotFound("Restaurant not found");
        var table = restaurant.Tables.FirstOrDefault(t => t.Id== tableId);
        if (table == null) return NotFound("Table not found");
        var value = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
        if (table.AssignedEmployeeId != null) return Conflict("Table is already assigned");
        Employee? assignedEmployee;
        if (value != null)
        {
            var employeeIdClaim = Guid.Parse(value);
            var employee = await _context.Employees.Where(e => e.RestaurantId == restId)
                .FirstOrDefaultAsync(e=> e.Id == employeeIdClaim);
            assignedEmployee = employee;
        }
        else
        {
            assignedEmployee = Table.AssignEmployee(_context, table);
        }
        if (assignedEmployee == null) return Conflict("No employees available");
        table.AssignedEmployeeId = assignedEmployee.Id;
        var client = new Client(restId, tableId, assignedEmployee.Id);
        await _context.Clients.AddAsync(client);
        await _context.SaveChangesAsync();
        table.ClientId = client.Id;
        await _context.SaveChangesAsync();
        var claims = new List<Claim> { new(ClaimTypes.Role, "client"), 
            new("restId", client.RestaurantId.ToString()),
            new("id", client.Id.ToString()),
            new("tableId", table.Id.ToString()),
            new("assignedEmployeeId", client.AssignedEmployeeId.ToString())
        };
        var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(3)),
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(),
                SecurityAlgorithms.HmacSha256));
        var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
        var response = new
        {
            token = encodedJwt
        };
        return Ok(response);
    }
        

    // DELETE: api/restaurants/0/Clients/5
    /// <summary>
    /// Удаление клиента
    /// </summary>
    /// <param name="id">ID клиента</param>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpDelete("{id:guid}")] 
    [Authorize(Roles = "employee")]
    public async Task<IActionResult> DeleteClient(Guid id, int restId)
    {
        var client = await _context.Clients.Where(c=> c.RestaurantId == restId)
            .Include(c=> c.FoodQueue)
            .ThenInclude(fq=> fq.FoodQueueExtras)
            .FirstOrDefaultAsync(c=> c.Id == id);
        if (client == null)
        {
            return NotFound("Client not found");
        }

        _context.Clients.Remove(client);
        var table = await _context.Tables.Where(t=> t.RestaurantId == restId)
            .FirstOrDefaultAsync(t=> t.Id == client.TableId);
        if (table != null) table.AssignedEmployeeId = null;
        await _context.SaveChangesAsync();

        return NoContent();
    }
    /// <summary>
    /// Завершение сессии клиентом
    /// </summary>
    /// <param name="restId">ID ресторана</param>
    /// <returns></returns>
    [HttpDelete] 
    [Authorize(Roles = "client")]
    public async Task<IActionResult> EndSession(int restId)
    {
        var restaurantClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
        var clientIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "id").Value);
        var restaurant = await _context.Restaurants.Include(r=> r.Clients)
            .ThenInclude(c=> c.FoodQueue)
            .ThenInclude(fq=> fq.FoodQueueExtras)
            .FirstOrDefaultAsync(r=> r.Id == restId);
        if (restaurantClaim != restId ) return BadRequest("Restaurant ID mismatch");
        if (restaurant == null) return NotFound("Restaurant not found");
        var client = restaurant.Clients.FirstOrDefault(c=> c.Id == clientIdClaim);
        if (client == null) return NotFound("Client not found");
        var table = await _context.Tables.Where(t=> t.RestaurantId == restId)
            .FirstOrDefaultAsync(t=> t.Id == client.TableId);
        _context.Clients.Remove(client);
        if (table == null) return NotFound("Table not found");
        table.AssignedEmployeeId = null;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ClientExists(Guid id, int restId)
    {
        return _context.Clients.Where(c=> c.RestaurantId == restId).Any(e => e.Id == id);
    }
}