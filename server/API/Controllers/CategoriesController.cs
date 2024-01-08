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
    public class CategoriesController : ControllerBase
    {
        private readonly QrCafeDbContext _context;

        public CategoriesController(QrCafeDbContext context)
        {
            _context = context;
        }

        // GET: /api/restaurants/0/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategory(int restId)
        {
            return await _context.Categories.Where(c=> c.RestaurantId == restId)
                .Select(c=> new CategoryDTO(c)).ToListAsync();
        }

        // GET: /api/restaurants/0/Categories/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Category>> GetCategory(int? id, int restId)
        {
            var category = await _context.Categories.Where(c=> c.RestaurantId == restId)
                .FirstOrDefaultAsync(c=> c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: /api/restaurants/0/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutCategory(int? id, Category category, int restId)
        {
            var categoryData = await
                _context.Categories.Where(e => e.RestaurantId == restId)
                    .FirstOrDefaultAsync(e=> e.Id==id);
            categoryData.Name = category.Name;
            categoryData.Description = category.Description;
            categoryData.Order = category.Order;
            categoryData.Separate = category.Separate;

            _context.Entry(categoryData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // POST: /api/restaurants/0/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> PostCategory(Category category, int restId)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            if (restaurant.Categories.FirstOrDefault(c => c.Order == category.Order) != null) 
                return Conflict();
            category.RestaurantId = restId;
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Ok(new CategoryDTO(category));
        }

        [HttpPost("{id:int}/food")]
        public async Task<ActionResult<IEnumerable<FoodDTO>>> PutFoodsIntoCategory(List<int> foodIdList, int restId, int id)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Foods)
                .Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            var addedFood = new List<FoodDTO>();
            foreach (var foodId in foodIdList)
            {
                var food = restaurant.Foods.FirstOrDefault(f => f.Id == foodId);
                if (food == null) continue;
                var foodCategory = new FoodCategory(foodId, id, restId);
                await _context.FoodCategories.AddAsync(foodCategory);
                addedFood.Add(new FoodDTO(food));
            }
        
            await _context.SaveChangesAsync();
            return Ok(addedFood);
        }
        
        // DELETE: /api/restaurants/0/Categories/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory(int? id, int restId)
        {
            var category = await _context.Categories.Where(c => c.RestaurantId == restId)
                .FirstOrDefaultAsync(c=> c.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        private bool CategoryExists(int? id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
