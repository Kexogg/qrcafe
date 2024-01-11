using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
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

        public IAmazonS3 client;
        public EmployeesController(QrCafeDbContext context)
        {
            _context = context;
            var credentials = new BasicAWSCredentials("nyashdev", "nyashdev");
            var config = new AmazonS3Config
            {
                ServiceURL = "https://s3.stk8s.66bit.ru",
                ForcePathStyle = true
            };
            client = new AmazonS3Client(credentials, config);
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
        public async Task<IActionResult> PatchEmployee(Guid id, [FromForm] Employee employee, int restId)
        {
            var employeeData = await
                _context.Employees.Where(e => e.RestaurantId == restId)
                    .FirstOrDefaultAsync(e=> e.Id==id);
            employeeData.FullName = employee.FullName;
            employeeData.Login = employee.Login;
            employeeData.RoleId = employee.RoleId;
            employeeData.Available = employee.Available;
            _context.Entry(employeeData).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
                if(Request is { HasFormContentType: true, Form.Files.Count: > 0 })
                {
                    var fileRequest = Request.Form.Files[0];
                    if (fileRequest.ContentType != "image/jpeg") return BadRequest("Invalid image type");
                    await using var stream = fileRequest.OpenReadStream();
                    var request = new PutObjectRequest
                    {
                        BucketName = "nyashdev",
                        Key = $"employees/{employee.Id.ToString()}.jpg",
                        InputStream = stream,
                        CannedACL = S3CannedACL.PublicRead
                    };
                    await client.PutObjectAsync(request);
                }
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
        /// <summary>
        /// Создание сотрудника
        /// </summary>
        /// <param name="employee">Сотрудник</param>
        /// <param name="restId">ID ресторана</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> PostEmployee([FromForm]Employee employee, int restId)
        {
            var restaurant = _context.Restaurants.Include(r=> r.Employees)
                .FirstOrDefault(r => r.Id == restId);
            if (restaurant == null) return BadRequest();
            if (restaurant.Employees.FirstOrDefault(e => e.Login == employee.Login) != null) 
                return Conflict();
            if (employee.Password == null) return Conflict();
            employee.RestaurantId = restId;
            await _context.Employees.AddAsync(employee);
            if(Request is { HasFormContentType: true, Form.Files.Count: > 0 })
            {
                var fileRequest = Request.Form.Files[0];
                if (fileRequest.ContentType != "image/jpeg") return BadRequest("Invalid image type");
                await using var stream = fileRequest.OpenReadStream();
                var request = new PutObjectRequest
                {
                    BucketName = "nyashdev",
                    Key = $"employees/{employee.Id.ToString()}.jpg",
                    InputStream = stream,
                    CannedACL = S3CannedACL.PublicRead
                };
                await client.PutObjectAsync(request);
            }
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
                token = encodedJwt,
                roleId = employee.RoleId
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
