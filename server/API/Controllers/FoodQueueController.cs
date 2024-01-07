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
    [Route("/api/restaurants/{restId:int}/[controller]")]
    [ApiController]
    public class FoodQueueController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public FoodQueueController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: /api/restaurants/0/FoodQueue
        [HttpGet]
        [Authorize (Roles = "employee")]
        public async Task<ActionResult<IEnumerable<FoodQueueDTO>>> GetFoodQueues(int restId)
        {
            return await _context.FoodQueues.Where(q=> q.RestaurantId==restId)
                .Select(q=> new FoodQueueDTO(q)).ToListAsync();
        }

        // GET: /api/restaurants/0/FoodQueue/5
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<FoodQueue>> GetFoodQueue(Guid id, int restId)
        {
            var foodQueue = await _context.FoodQueues.Where(q=> q.RestaurantId == restId)
                .FirstOrDefaultAsync(q=> q.Id == id);

            if (foodQueue == null)
            {
                return NotFound();
            }

            return foodQueue;
        }

        // PUT: /api/restaurants/0/FoodQueue/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch]
        [Authorize (Roles = "employee")]
        public async Task<IActionResult> PutFoodQueue(Guid id, FoodQueue foodQueue, int restId)
        {
            if (id != foodQueue.Id || restId!=foodQueue.RestaurantId)
            {
                return BadRequest();
            }

            _context.Entry(foodQueue).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoodQueueExists(id, restId))
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

        // POST: /api/restaurants/0/FoodQueue
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize (Roles = "client")]
        public async Task<ActionResult<IEnumerable<FoodQueueDTO>>> PostFoodQueue(List<Food> foodList, int restId)
        {
            var restaurantClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
            var clientIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "clientId").Value);
            var restaurant = await _context.Restaurants.Include(r=> r.Clients)
                .FirstOrDefaultAsync(r=> r.Id == restId);
            if (restaurantClaim != restId || restaurant == null) return BadRequest();
            var client = restaurant.Clients.FirstOrDefault(c=> c.Id == clientIdClaim);
            if (client == null) return NotFound();
            var time = TimeOnly.FromDateTime(DateTime.Now);
            var queue = new List<FoodQueueDTO>();
            foreach (var foodQueue in foodList.Select(food => new FoodQueue(food, client.Id, Guid.NewGuid(), time)))
            {
                queue.Add(new FoodQueueDTO(foodQueue));
                await _context.FoodQueues.AddAsync(foodQueue);
            }
            await _context.SaveChangesAsync();
            return Ok(queue);
        }

        // DELETE: /api/restaurants/0/FoodQueue/5
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteFoodQueue(Guid id, int restId)
        {
            var foodQueue = await _context.FoodQueues.Where(q=> q.RestaurantId == restId)
                .FirstOrDefaultAsync(q=> q.Id == id);
            if (foodQueue == null)
            {
                return NotFound();
            }

            _context.FoodQueues.Remove(foodQueue);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodQueueExists(Guid id, int restId)
        {
            return _context.FoodQueues.Where(q=> q.RestaurantId == restId).Any(e => e.Id == id);
        }
    }
}
