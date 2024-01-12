using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QrCafe.Models;

namespace QrCafe.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "employee")]
    [ApiController]
    public class OrganizationsController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public OrganizationsController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/Organizations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrganizationDTO>>> GetOrganizations()
        {
            return await _context.Organizations.Select(o=> new OrganizationDTO(o)).ToListAsync();
        }

        // GET: api/Organizations/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Organization>> GetOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);

            if (organization == null)
            {
                return NotFound();
            }

            return organization;
        }

        // PUT: api/Organizations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutOrganization(int id, Organization organization)
        {
            if (id != organization.Id)
            {
                return BadRequest();
            }

            _context.Entry(organization).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrganizationExists(id))
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

        // POST: api/Organizations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Organization>> PostOrganization(OrganizationDTO organizationDto)
        {
            var random = new Random();
            var orgId = random.Next(10000, 21473);
            while (_context.Organizations.FirstOrDefault(r=>r.Id == orgId)!=null)
            {
                orgId = random.Next(10000, 21473);
            }
            var organization = new Organization(organizationDto, orgId);
            await _context.Organizations.AddAsync(organization);
            await _context.SaveChangesAsync();
            return Ok(new OrganizationDTO(organization));
        }

        // DELETE: api/Organizations/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization == null)
            {
                return NotFound();
            }

            _context.Organizations.Remove(organization);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrganizationExists(int id)
        {
            return _context.Organizations.Any(e => e.Id == id);
        }
    }
}
