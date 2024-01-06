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
        public async Task<ActionResult<IEnumerable<Category>>> GetCategory(int restId)
        {
            return await _context.Categories.ToListAsync();
        }

        // GET: /api/restaurants/0/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int? id, int restId)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: /api/restaurants/0/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int? id, Category category, int restId)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

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
        public async Task<ActionResult<CategoryDTO>> PostCategory(CategoryDTO categoryDto, int restId)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            if (restaurant.Categories.FirstOrDefault(c => c.Order == categoryDto.Order) != null) 
                return Conflict();
            var random = new Random();
            var id = random.Next(1, 1000000);
            while (restaurant.Categories.Where(c=> c.RestaurantId==restId)
                       .FirstOrDefault(c => c.Id == id) != null) id = random.Next(1, 1000000);
            var category = new Category(categoryDto, restId, id);
            categoryDto.Id = id;
            categoryDto.RestaurantId = restId;
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Ok(categoryDto);
        }

        [HttpPost("/{id:int}/food")]
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
