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
        /// <summary>
        /// Получение списка категорий
        /// </summary>
        /// <param name="restId">ID ресторана</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategory(int restId)
        {
            return await _context.Categories.Where(c=> c.RestaurantId == restId)
                .Select(c=> new CategoryDTO(c)).ToListAsync();
        }

        // GET: /api/restaurants/0/Categories/5
        /// <summary>
        /// Получение категории по id
        /// </summary>
        /// <param name="id">ID категории</param>
        /// <param name="restId">ID ресторана</param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int? id, int restId)
        {
            var restaurant = await _context.Restaurants.Include(restaurant => restaurant.Categories)
                .ThenInclude(c=> c.FoodCategories).ThenInclude(fc=> fc.Food)
                .FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();
            var category = restaurant.Categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }

            var categoryDTO = new CategoryDTO(category);
            foreach (var foodCategory in category.FoodCategories)
            {
                categoryDTO.FoodList.Add(new FoodDTO(foodCategory.Food));
            }
            
            return categoryDTO;
        }

        // PUT: /api/restaurants/0/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /// <summary>
        /// Изменение категории
        /// </summary>
        /// <param name="id">ID категории</param>
        /// <param name="categoryDto">Категория</param>
        /// <param name="restId">ID ресторана</param>
        /// <returns></returns>
        [HttpPut("{id:int}/food")]
        public async Task<IActionResult> PutCategory(int id, CategoryDTO categoryDto, int restId)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Foods)
                .Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
            var category = restaurant?.Categories.FirstOrDefault(c => c.Id == id);
            if (restaurant == null || category == null) return NotFound();
            category.Order = categoryDto.Order;
            category.Separate = categoryDto.Separate;
            category.Name= categoryDto.Name;
            category.Description = categoryDto.Description;
            var addedFood = new List<FoodDTO>();
            await _context.FoodCategories.Where(fc => fc.RestaurantId == restId && fc.CategoryId == id)
                .ExecuteDeleteAsync();
            if (categoryDto.FoodIdList != null)
                foreach (var foodId in categoryDto.FoodIdList)
                {
                    var food = restaurant.Foods.FirstOrDefault(f => f.Id == foodId);
                    if (food == null) continue;
                    var foodCategory = new FoodCategory(foodId, id, restId);
                    await _context.FoodCategories.AddAsync(foodCategory);
                    addedFood.Add(new FoodDTO(food));
                }

            await _context.SaveChangesAsync();
            var result = new
            {
                category,
                addedFood
            };
            return Ok(result);
        }

        // POST: /api/restaurants/0/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /// <summary>
        /// Создание категории
        /// </summary>
        /// <param name="category">Категория</param>
        /// <param name="restId">ID ресторана</param>
        /// <returns></returns>
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

        /// <summary>
        /// Добавление блюд в категорию
        /// </summary>
        /// <param name="foodIdList">Список ID блюд</param>
        /// <param name="restId">ID ресторана</param>
        /// <param name="id">ID категории</param>
        /// <returns></returns>
        [HttpPost("{id:int}")]
        public async Task<ActionResult<IEnumerable<FoodDTO>>> PutFoodsIntoCategory(List<int> foodIdList, int restId, int id)
        {
            var restaurant = await _context.Restaurants.Include(r => r.Foods)
                .Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant?.Categories.FirstOrDefault(c=> c.Id == id) == null) return NotFound();
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
        /// <summary>
        /// Удаление категории
        /// </summary>
        /// <param name="id">ID категории</param>
        /// <param name="restId">ID ресторана</param>
        /// <returns></returns>
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
