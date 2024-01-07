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
    [Authorize(Roles = "employee")]
    public class FoodController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public FoodController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: /api/restaurants/0/categories/Food
        [HttpGet("/api/restaurants/{restId:int}/categories/food")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetFoodsInCategories(int restId)
        {
            var restaurant = await _context.Restaurants.Include(restaurant => restaurant.Categories)
                .ThenInclude(c=> c.FoodCategories).ThenInclude(fc=> fc.Food)
                .FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            var result = new List<CategoryDTO>();
            foreach (var category in restaurant.Categories)
            {
                var categoryDTO = new CategoryDTO(category);
                foreach (var foodCategory in category.FoodCategories)
                {
                    categoryDTO.foodList.Add(new FoodDTO(foodCategory.Food));
                }
                result.Add(categoryDTO);
            }
            return Ok(result);
        }
        // GET: /api/restaurants/0/Food
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<FoodDTO>>> GetFoods(int restId)
        {
            return await _context.Foods.Where(f => f.RestaurantId == restId)
                .Select(f => new FoodDTO(f)).ToListAsync();
        }
        // GET: /api/restaurants/0/Food/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Food>> GetFood(int id, int restId)
        {
            var food = await _context.Foods.Where(f=> f.RestaurantId == restId)
                .FirstOrDefaultAsync(f=> f.Id == id);

            if (food == null)
            {
                return NotFound();
            }

            return food;
        }

        // PUT: /api/restaurants/0/Food/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PutFood(int id, Food food, int restId)
        {
            if (id != food.Id || restId != food.RestaurantId)
            {
                return BadRequest();
            }

            _context.Entry(food).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoodExists(id, restId))
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

        // POST: /api/restaurants/0/Food
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FoodDTO>> PostFood(FoodDTO foodDto, int restId)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            var random = new Random();
            var id = random.Next(1, 1000000);
            while (restaurant.Categories.FirstOrDefault(c => c.Id == id) != null) id = random.Next(1, 1000000);
            var food = new Food(foodDto, id, restId);
            foodDto.Id = id;
            foodDto.RestaurantId = restId;
            await _context.Foods.AddAsync(food);
            await _context.SaveChangesAsync();
            return Ok(foodDto);
        }
        
        [HttpPost("/api/restaurants/{restId:int}/categories/food/{id:int}")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> PutFoodIntoCategories(List<int> categoriesIdList, 
            int restId, int id)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Foods)
                .Include(r => r.Categories).FirstOrDefaultAsync(r=> r.Id == restId);
            if (restaurant == null) return NotFound();
            var addedCategories = new List<CategoryDTO>();
            foreach (var categoryId in categoriesIdList)
            {
                var category = restaurant.Categories.FirstOrDefault(c => c.Id == categoryId);
                if (category == null) continue;
                var foodCategory = new FoodCategory(id, categoryId, restId);
                addedCategories.Add(new CategoryDTO(category));
                await _context.FoodCategories.AddAsync(foodCategory);
            }

            await _context.SaveChangesAsync();
            return Ok(addedCategories);
        }

        // DELETE: /api/restaurants/0/Food/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFood(int id, int restId)
        {
            var food = await _context.Foods.Where(f=> f.RestaurantId == restId)
                .FirstOrDefaultAsync(f=> f.Id == id);
            if (food == null)
            {
                return NotFound();
            }

            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodExists(int id, int restId)
        {
            return _context.Foods.Where(f=> f.RestaurantId == restId).Any(e => e.Id == id);
        }
    }
}
