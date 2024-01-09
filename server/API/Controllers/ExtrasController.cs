using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QrCafe;
using QrCafe.Models;

namespace QrCafe.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize (Roles = "employee")]
    public class ExtrasController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public ExtrasController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: api/Extras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Extra>>> GetExtras()
        {
            return await _context.Extras.ToListAsync();
        }

        // GET: api/Extras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Extra>> GetExtra(int id)
        {
            var extra = await _context.Extras.FindAsync(id);

            if (extra == null)
            {
                return NotFound();
            }

            return extra;
        }

        // PUT: api/Extras/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExtra(int id, Extra extra)
        {
            if (id != extra.Id)
            {
                return BadRequest();
            }

            _context.Entry(extra).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExtraExists(id))
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

        // POST: api/Extras
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Extra>> PostExtra(Extra extra)
        {
            _context.Extras.Add(extra);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExtra", new { id = extra.Id }, extra);
        }

        // DELETE: api/Extras/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExtra(int id)
        {
            var extra = await _context.Extras.FindAsync(id);
            if (extra == null)
            {
                return NotFound();
            }

            _context.Extras.Remove(extra);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExtraExists(int id)
        {
            return _context.Extras.Any(e => e.Id == id);
        }
    }
}
