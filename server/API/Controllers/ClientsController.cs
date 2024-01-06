using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QrCafe;
using QrCafe.Models;

namespace QrCafe.Controllers
{
    [Route("api/")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public ClientsController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/restaurants/0/clients
        [Route("restaurants/{restId:int}/clients")]
        [HttpGet]
        [Authorize(Roles = "employee")]
        public async Task<ActionResult<IEnumerable<ClientDTO>>> GetClients(int restId)
        {
            return await _context.Clients.Where(c=> c.RestaurantId == restId)
                .Select(c => new ClientDTO(c)).ToListAsync();
        }

        // GET: api/clients/5
        /*[HttpGet("clients/{id}")]
        public async Task<ActionResult<ClientDTO>> GetClient(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);

            if (client == null)
            {
                return NotFound();
            }

            return new ClientDTO(client);
        }*/

        // POST: api/Clients/restaurants/{restId:int}/tables/{tableNum:int}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("restaurants/{restId:int}/tables/{tableId:int}")]
        public async Task<IActionResult> PutClient(ClientDTO clientDto, int restId, int tableId)
        {
            var restaurant = _context.Restaurants.Include(restaurant => restaurant.Tables)
                .FirstOrDefault(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            var table = restaurant.Tables.FirstOrDefault(t => t.Id== tableId);
            if (table == null) return BadRequest();
            if (table.AssignedEmployeeId != null) return BadRequest();
            var employee = Table.AssignEmployee(_context, table);
            table.AssignedEmployee = employee;
            table.AssignedEmployeeId = employee.Id;
            var client = new Client(clientDto, restId, tableId, employee.Id);
            await _context.Clients.AddAsync(client);
            await _context.SaveChangesAsync();
            var claims = new List<Claim> { new(ClaimTypes.Role, "client"), 
                new("restId", client.RestaurantId.ToString()),
                new("clientId", client.Id.ToString())};
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromHours(1)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(),
                    SecurityAlgorithms.HmacSha256));
            string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            var response = new
            {
                access_token = encodedJwt
            };
            return Ok(response);
        }
        

        // DELETE: api/Clients/5
        /*[HttpDelete("clients/{id}")] public async Task<IActionResult> DeleteClient(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }*/

        private bool ClientExists(Guid id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }
    }
}
