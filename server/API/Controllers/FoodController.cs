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
                    categoryDTO.FoodList.Add(new FoodDTO(foodCategory.Food));
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
        public async Task<IActionResult> PatchFood(int id, FoodDTO foodDto, int restId)
        {
            var foodData = await
                _context.Foods.Where(e => e.RestaurantId == restId)
                    .FirstOrDefaultAsync(e=> e.Id == id);
            if (foodData == null) return NotFound();
            foodData.Name = foodDto.Name;
            foodData.Description = foodDto.Description;
            foodData.Weight = foodDto.Weight;
            foodData.Price = foodDto.Price;
            foodData.Available = foodDto.Available;
            
            _context.Entry(foodData).State = EntityState.Modified;
            
            await _context.FoodExtras.Where(fc => fc.RestaurantId == restId && fc.FoodId == id)
                .ExecuteDeleteAsync();
            var extras = new List<ExtraDTO>();
            if (foodDto.Extras != null)
                foreach (var extraDto in foodDto.Extras)
                {
                    var extra = new Extra(extraDto);
                    await _context.Extras.AddAsync(extra);
                    await _context.SaveChangesAsync();
                    var foodExtra = new FoodExtra(foodData.Id, extra.Id, restId);
                    await _context.FoodExtras.AddAsync(foodExtra);
                    extraDto.Id = extra.Id;
                    extras.Add(extraDto);
                }
            await _context.SaveChangesAsync();
            var result = new FoodDTO(foodData)
            {
                Extras = extras
            };
            return Ok(result);
        }

        // POST: /api/restaurants/0/Food
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FoodDTO>> PostFood(FoodDTO foodDto, int restId)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            var food = new Food(foodDto)
            {
                RestaurantId = restId
            };
            await _context.Foods.AddAsync(food);
            var extras = new List<ExtraDTO>();
            if (foodDto.Extras != null)
                foreach (var extraDto in foodDto.Extras)
                {
                    var extra = new Extra(extraDto);
                    await _context.Extras.AddAsync(extra);
                    await _context.SaveChangesAsync();
                    var foodExtra = new FoodExtra(food.Id, extra.Id, restId);
                    await _context.FoodExtras.AddAsync(foodExtra);
                    extraDto.Id = extra.Id;
                    extras.Add(extraDto);
                }
            await _context.SaveChangesAsync();
            var result = new FoodDTO(food)
            {
                Extras = extras
            };
            return Ok(result);
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
