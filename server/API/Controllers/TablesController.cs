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
    [Route("api/restaurants/{restId:int}/[controller]")]
    [Authorize(Roles = "employee")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public TablesController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: /api/restaurants/0/tables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TableDTO>>> GetTables(int restId)
        {
            return await _context.Tables.Where(t=> t.RestaurantId == restId)
                .Select(t=> new TableDTO(t)).ToListAsync();
        }

        // GET: api/restaurants/0/Tables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Table>> GetTable(int id, int restId)
        {
            var table = await _context.Tables.FindAsync(id);

            if (table == null)
            {
                return NotFound();
            }

            return table;
        }

        // POST: api/restaurants/0/Tables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Table>> PostTable(int restId)
        {
            var restaurant = _context.Restaurants.Include(r=> r.Tables).FirstOrDefault(r=> r.Id == restId);
            if (restaurant == null) return NotFound();
            var table = new Table{Id = restaurant.Tables.Count+1, RestaurantId = restId};
            await _context.Tables.AddAsync(table);
            await _context.SaveChangesAsync();
            return Ok(new TableDTO(table));
        }

        // DELETE: api/restaurants/0/Tables/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTable(int id, int restId)
        {
            var table = await _context.Tables.Where(t=> t.RestaurantId==restId)
                .FirstOrDefaultAsync(t=> t.Id==id);
            if (table == null)
            {
                return NotFound();
            }

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TableExists(int id)
        {
            return _context.Tables.Any(e => e.Id == id);
        }
    }
}
