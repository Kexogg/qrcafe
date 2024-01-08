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
    [Route("api/restaurants/{restId:int}/[controller]")]
    [ApiController]
    [Authorize (Roles = "employee")]
    public class EmployeesController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public EmployeesController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/restaurants/0/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetEmployees(int restId)
        {
            return await _context.Employees.Where(e=> e.RestaurantId==restId)
                .Select(e=> new EmployeeDTO(e)).ToListAsync();
        }

        // GET: api/restaurants/0/Employees/5
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EmployeeDTO>> GetEmployee(Guid id, int restId)
        {
            var employee = await _context.Employees.Where(e=> e.RestaurantId == restId)
                .FirstOrDefaultAsync(e=> e.Id == id);

            if (employee == null)
            {
                return NotFound();
            }

            return new EmployeeDTO(employee);
        }
        
        [HttpGet("info")]
        public async Task<ActionResult<EmployeeDTO>> GetEmployeeInfo(int restId)
        {
            var employeeIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value);
            var employee = await _context.Employees.Where(e => e.RestaurantId == restId)
                .FirstOrDefaultAsync(e=> e.Id == employeeIdClaim);

            if (employee == null)
            {
                return NotFound();
            }

            return new EmployeeDTO(employee);
        }
        
        //PUT: api/restaurants/0/Employees
        [HttpPut]
        public async Task<IActionResult> ChangeShiftState([FromQuery] bool state, int restId)
        {
            var employeeIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value);
            var employee = await _context.Employees.Where(e => e.RestaurantId == restId)
                .FirstOrDefaultAsync(e=> e.Id == employeeIdClaim);
            if (employee == null) return NotFound();
            employee.Available = state;
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
            return Ok(new EmployeeDTO(employee));
        }
        
        // PATCH: api/restaurants/0/Employees/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> PutEmployee(Guid id, Employee employee, int restId)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id, restId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/restaurants/0/Employees
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostEmployee(Employee employee, int restId)
        {
            var restaurant = _context.Restaurants.Include(r=> r.Employees)
                .FirstOrDefault(r => r.Id == restId);
            if (restaurant == null) return BadRequest();
            if (restaurant.Employees.FirstOrDefault(e => e.Login == employee.Login) != null) 
                return Conflict();
            employee.RestaurantId = restId;
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
            return Ok(new EmployeeDTO(employee));
        }
        
        // POST: api/restaurants/0/Employees/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> PostLogin(EmployeeLoginData employeeLoginData, int restId)
        {
            var restaurant = await _context.Restaurants.Include(r=> r.Employees)
                .FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return BadRequest();
            var employee = restaurant.Employees.FirstOrDefault(e =>
                e.Login == employeeLoginData.Login && e.Password == employeeLoginData.Password);
            if (employee == null) return Unauthorized();
            var claims = new List<Claim> { new(ClaimTypes.Name, employee.Login),
                new(ClaimTypes.Role,"employee"),
                new("employeeId", employee.Id.ToString())
            };
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromHours(24)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), 
                    SecurityAlgorithms.HmacSha256));
            string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            var response = new
            {
                access_token = encodedJwt
            };
            return Ok(response);
        }
        
        // DELETE: api/restaurants/0/Employees/5
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteEmployee(Guid id, int restId)
        {
            var employee = await _context.Employees.Where(e=> e.RestaurantId==restId)
                .FirstOrDefaultAsync(e=> e.Id==id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(Guid id, int restId)
        {
            return _context.Employees.Where(e=> e.RestaurantId == restId).Any(e => e.Id == id);
        }
    }
}
