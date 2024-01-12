using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        [Authorize(Roles = "client, employee")]
        public async Task<ActionResult<IEnumerable<FoodQueueDTO>>> GetFoodQueue(int restId)
        {
            var result = new List<FoodQueueDTO>();
            if (User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role).Value == "employee")
            {
                var tables = await _context.Tables
                    .Where(t => t.RestaurantId == restId && t.ClientId != null).ToListAsync();
                foreach (var item in tables)
                {
                    result.AddRange(GetFoodQueueList(restId, item.Id).Result);
                }
                return result;
            }
            var restaurantIdClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
            var tableIdClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "tableId")?.Value);
            var table = await _context.Tables.Where(t=> t.RestaurantId == restId)
                .FirstOrDefaultAsync(r=> r.Id == tableIdClaim);
            if (restaurantIdClaim != restId || table == null) return BadRequest();
            var list  = await GetFoodQueueList(restId, tableIdClaim);
            result = list.ToList();
            return result;
        }
        
        [HttpGet("{tableId:int}")]
        [Authorize(Roles = "employee")]
        public async Task<ActionResult<IEnumerable<FoodQueueDTO>>> GetFoodQueueByTableId(int tableId, int restId)
        {
            var foodQueue = await GetFoodQueueList(restId, tableId);
            return foodQueue != null ? foodQueue.ToList() : new List<FoodQueueDTO>();
        }

        // PUT: /api/restaurants/0/FoodQueue/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch]
        [Authorize (Roles = "employee")]
        public async Task<IActionResult> PatchFoodQueue(Guid id, FoodQueue foodQueueData, int restId)
        {
            var foodQueue = await _context.FoodQueues.Where(fq => fq.RestaurantId == restId)
                .FirstOrDefaultAsync(fq=> fq.Id == foodQueueData.Id);
            if (foodQueue == null) return NotFound();

            foodQueue.State = foodQueueData.State;
            foodQueue.Count = foodQueueData.Count;

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
        
        [HttpPost("clients/{clientId:guid}")]
        [Authorize (Roles = "employee")]
        public async Task<ActionResult<IEnumerable<FoodQueueDTO>>> PostFoodQueueByEmployee(List<FoodOrder> foodList, int restId, Guid clientId)
        {
            var employeeIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value);
            var restaurant = await _context.Restaurants.Include(r=>r.Employees)
                .ThenInclude(r => r.Clients)
                .Include(r => r.Foods).ThenInclude(food => food.FoodExtras)
                .Include(r=> r.FoodQueues)
                .FirstOrDefaultAsync(r=> r.Id == restId);
            if (restaurant == null) return BadRequest();
            var employee = restaurant.Employees.FirstOrDefault(e=> e.Id == employeeIdClaim);
            var client = employee.Clients.FirstOrDefault(c => c.Id == clientId);
            if (client == null) return NotFound();
            var time = TimeOnly.FromDateTime(DateTime.Now);
            foreach (var foodItem in foodList)
            {
                var food = restaurant.Foods.FirstOrDefault(f=> f.Id == foodItem.Id);
                if (food == null) continue;
                {
                    var foodQueue = new FoodQueue(foodItem, client.Id, restId, time);
                    await _context.FoodQueues.AddAsync(foodQueue);
                    if (foodItem.ExtrasId == null) continue;
                    foreach (var extraId in foodItem.ExtrasId
                                 .Where(extraId => food.FoodExtras.Any(fe => fe.ExtraId == extraId)))
                    {
                        var foodQueueExtra = new FoodQueueExtra(foodQueue.Id, extraId, restId);
                        await _context.FoodQueueExtras.AddAsync(foodQueueExtra);
                    }
                }
            }
            await _context.SaveChangesAsync();
            var queue = await GetFoodQueueList(restaurant.Id, client.TableId);
            return Ok(queue);
        }

        // POST: /api/restaurants/0/FoodQueue
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize (Roles = "client")]
        public async Task<ActionResult<IEnumerable<FoodQueueDTO>>> PostFoodQueue(List<FoodOrder> foodList, int restId)
        {
            var restaurantIdClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "restId")?.Value);
            var clientIdClaim = Guid.Parse(User.Claims.FirstOrDefault(c => c.Type == "clientId").Value);
            var tableIdClaim = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "tableId")?.Value);
            var restaurant = await _context.Restaurants.Include(r => r.Clients)
                .Include(r => r.Foods).ThenInclude(food => food.FoodExtras)
                .Include(r=> r.FoodQueues)
                .FirstOrDefaultAsync(r=> r.Id == restId);
            if (restaurantIdClaim != restId || restaurant == null) return BadRequest();
            var client = restaurant.Clients.FirstOrDefault(c=> c.Id == clientIdClaim);
            if (client == null) return NotFound();
            var time = TimeOnly.FromDateTime(DateTime.Now);
            foreach (var foodItem in foodList)
            {
                var food = restaurant.Foods.FirstOrDefault(f=> f.Id == foodItem.Id);
                if (food == null) continue;
                {
                    var foodQueue = new FoodQueue(foodItem, client.Id, restId, time);
                    await _context.FoodQueues.AddAsync(foodQueue);
                    if (foodItem.ExtrasId == null) continue;
                    foreach (var extraId in foodItem.ExtrasId
                                 .Where(extraId => food.FoodExtras.Any(fe => fe.ExtraId == extraId)))
                    {
                        var foodQueueExtra = new FoodQueueExtra(foodQueue.Id, extraId, restId);
                        await _context.FoodQueueExtras.AddAsync(foodQueueExtra);
                    }
                }
            }
            await _context.SaveChangesAsync();
            var queue = await GetFoodQueueList(restaurantIdClaim, tableIdClaim);
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

            await _context.FoodQueueExtras.Where(fqe => fqe.FoodQueueId == foodQueue.Id).ExecuteDeleteAsync();
            _context.FoodQueues.Remove(foodQueue);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodQueueExists(Guid id, int restId)
        {
            return _context.FoodQueues.Where(q=> q.RestaurantId == restId).Any(e => e.Id == id);
        }

        private async Task<IEnumerable<FoodQueueDTO>> GetFoodQueueList(int restId, int tableId)
        {
            var table  = await _context.Tables.Where(t => t.RestaurantId == restId).Include(t => t.Client)
                .ThenInclude(c => c.FoodQueue).ThenInclude(fq => fq.FoodQueueExtras)
                .ThenInclude(fqe => fqe.Extra)
                .Include(t=>t.Client.FoodQueue)
                .ThenInclude(fq=> fq.Food)
                .FirstOrDefaultAsync(t => t.Id == tableId);
            var foodQueueItems = table?.Client?.FoodQueue.ToList();

            return foodQueueItems?.Select(item => new FoodQueueDTO(item)).ToList();
        }
    }
}
