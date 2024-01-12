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
                .Include(t=> t.AssignedEmployee)
                .Select(t=> new TableDTO(t)).ToListAsync();
        }
        
        [HttpGet("getall")]
        public async Task<ActionResult<IEnumerable<TableDTO>>> GetAllTablesInfo(int restId)
        {
            return await _context.Tables.Where(t => t.RestaurantId == restId)
                .Include(t=> t.AssignedEmployee)
                .Include(t => t.Client)
                .ThenInclude(c => c.FoodQueue).ThenInclude(fq => fq.FoodQueueExtras)
                .ThenInclude(fqe => fqe.Extra)
                .Include(t=>t.Client.FoodQueue)
                .ThenInclude(fq=> fq.Food)
                .Include(t=> t.Client).ThenInclude(c=>c.AssignedEmployee)
                .Select(t=> new TableDTO(t))
                .ToListAsync();
        }
        
        // GET: api/restaurants/0/Tables/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TableDTO>> GetTable(int id, int restId)
        {
            var table = await _context.Tables.Where(t=> t.RestaurantId==restId)
                .Include(t=> t.AssignedEmployee)
                .FirstOrDefaultAsync(t=> t.Id == id);

            if (table == null)
            {
                return NotFound();
            }

            return new TableDTO(table);
        }
        
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchTable(int id, Table table, int restId)
        {
            var tableData = await _context.Tables.Where(t => t.RestaurantId == restId)
                .FirstOrDefaultAsync(t => t.Id == id);
            if (tableData == null)
            {
                return BadRequest();
            }

            tableData.Name = table.Name;
            if(table.AssignedEmployeeId != null)
                tableData.AssignedEmployeeId = table.AssignedEmployeeId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id, restId))
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
        
        // POST: api/restaurants/0/Tables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Table>> PostTable([FromQuery]string name,int restId)
        {
            var restaurant = _context.Restaurants.Include(r=> r.Tables).FirstOrDefault(r=> r.Id == restId);
            if (restaurant == null) return NotFound();
            var table = new Table{Name = name, RestaurantId = restId};
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

        private bool TableExists(int id, int restId)
        {
            return _context.Tables.Where(t=> t.RestaurantId == restId).Any(e => e.Id == id);
        }
    }
}
