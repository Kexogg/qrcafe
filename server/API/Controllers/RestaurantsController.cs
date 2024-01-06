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
    [Route("/api/organizations/{orgId:int}/[controller]")]
    [ApiController]
    [Authorize(Roles = "employee")]
    public class RestaurantsController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public RestaurantsController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: /api/organizations/{orgId:int}/Restaurants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RestaurantDTO>>> GetRestaurants(int orgId)
        {
            var organization = await _context.Organizations.Include(o=>o.Restaurants)
                .FirstOrDefaultAsync(o => o.Id == orgId);
            if (organization == null) return BadRequest();
            return organization.Restaurants.Select(r => new RestaurantDTO(r)).ToList();
        }

        // GET: /api/organizations/{orgId:int}/Restaurants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);

            if (restaurant == null)
            {
                return NotFound();
            }

            return restaurant;
        }

        // PUT: /api/organizations/{orgId:int}/Restaurants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRestaurant(int id, Restaurant restaurant, int orgId)
        {
            if (id != restaurant.Id)
            {
                return BadRequest();
            }

            _context.Entry(restaurant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RestaurantExists(id))
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

        // POST: /api/organizations/{orgId:int}/Restaurants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Restaurant>> PostRestaurant(RestaurantDTO restaurantDto, int orgId)
        {
            var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.Id == orgId);
            if (organization == null) return BadRequest();
            var random = new Random();
            var restId = random.Next(10000, 100000);
            while (await _context.Restaurants.Where(r=> r.OrgId ==orgId).FirstOrDefaultAsync(r=>r.Id == restId)!=null)
            {
                restId = random.Next(10000, 100000);
            }
            var restaurant = new Restaurant(restaurantDto, restId, orgId);
            await _context.Restaurants.AddAsync(restaurant);
            await _context.SaveChangesAsync();
            return Ok(new RestaurantDTO(restaurant));
        }

        // DELETE: /api/Restaurants/5
        [HttpDelete("/api/Restaurants/{id:int}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RestaurantExists(int id)
        {
            return _context.Restaurants.Any(e => e.Id == id);
        }
    }
}
