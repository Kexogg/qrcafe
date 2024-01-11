using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
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

        public IAmazonS3 client;

        public FoodController(QrCafeDbContext context)
        {
            _context = context;
            var credentials = new BasicAWSCredentials("nyashdev", "nyashdev");
            var config = new AmazonS3Config
            {
                ServiceURL = "https://s3.stk8s.66bit.ru",
                ForcePathStyle = true
            };
            client = new AmazonS3Client(credentials, config);
        }

        // GET: /api/restaurants/0/categories/Food
        [HttpGet("/api/restaurants/{restId:int}/categories/food")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetFoodsInCategories(int restId)
        {
            var restaurant = await _context.Restaurants.Include(restaurant => restaurant.Categories)
                .ThenInclude(c => c.FoodCategories).ThenInclude(fc => fc.Food)
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
            var foodList = await _context.Foods.Where(f => f.RestaurantId == restId)
                .Include(f => f.FoodExtras).ThenInclude(fe => fe.Extra)
                .ToListAsync();
            var result = new List<FoodDTO>();
            foreach (var food in foodList)
            {
                var foodResult = new FoodDTO(food);
                foreach (var item in food.FoodExtras)
                {
                    foodResult.Extras?.Add(new ExtraDTO(item.Extra));
                }

                result.Add(foodResult);
            }

            return result;
        }

        // GET: /api/restaurants/0/Food/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<FoodDTO>> GetFood(int id, int restId)
        {
            var food = await _context.Foods.Where(f => f.RestaurantId == restId)
                .Include(f => f.FoodExtras).ThenInclude(fe => fe.Extra)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (food == null)
            {
                return NotFound();
            }

            var result = new FoodDTO(food);
            foreach (var item in food.FoodExtras)
            {
                result.Extras?.Add(new ExtraDTO(item.Extra));
            }

            return result;
        }

        // PUT: /api/restaurants/0/Food/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchFood(int id, [FromForm] FoodDTO foodDto, int restId)
        {
            var food = await
                _context.Foods.Where(e => e.RestaurantId == restId)
                    .FirstOrDefaultAsync(e => e.Id == id);
            if (food == null) return NotFound();
            food.Name = foodDto.Name;
            food.Description = foodDto.Description;
            food.Weight = foodDto.Weight;
            food.Price = foodDto.Price;
            food.Available = foodDto.Available;

            _context.Entry(food).State = EntityState.Modified;
            
            if (Request.HasFormContentType)
            {
                var fileRequest = Request.Form.Files[0];
                if (fileRequest.ContentType != "image/jpeg") return BadRequest("Invalid image type");
                await using var stream = fileRequest.OpenReadStream();
                var request = new PutObjectRequest
                {
                    BucketName = "nyashdev",
                    Key = $"food/{food.Id.ToString()}.jpg",
                    InputStream = stream,
                    CannedACL = S3CannedACL.PublicRead
                };
                await client.PutObjectAsync(request);

            }
            
            await _context.FoodExtras.Where(fc => fc.RestaurantId == restId && fc.FoodId == id)
                .ExecuteDeleteAsync();
            var extras = new List<ExtraDTO>();
            var extrasJson = Request.Form.Where(k => k.Key == "extras");
            foreach (var items in extrasJson)
            {
                foreach (var extra in items.Value.Select(item => item.FromJson<Extra>()))
                {
                    await _context.Extras.AddAsync(extra);
                    await _context.SaveChangesAsync();
                    var foodExtra = new FoodExtra(food.Id, extra.Id, restId);
                    await _context.FoodExtras.AddAsync(foodExtra);
                    extras.Add(new ExtraDTO(extra));
                }
            }

            await _context.SaveChangesAsync();
            var result = new FoodDTO(food)
            {
                Extras = extras
            };
            return Ok(result);
        }

        // POST: /api/restaurants/0/Food
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FoodDTO>> PostFood([FromForm] FoodDTO foodDto, int restId)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == restId);
            if (restaurant == null) return NotFound();

            var food = new Food(foodDto)
            {
                RestaurantId = restId
            };
            await _context.Foods.AddAsync(food);
            if (Request.HasFormContentType && Request.Form.Files.Count != 0)
            {
                var fileRequest = Request.Form.Files[0];
                if (fileRequest.ContentType != "image/jpeg") return BadRequest("Invalid image type");
                await using var stream = fileRequest.OpenReadStream();
                var request = new PutObjectRequest
                {
                    BucketName = "nyashdev",
                    Key = $"food/{food.Id.ToString()}.jpg",
                    InputStream = stream,
                    CannedACL = S3CannedACL.PublicRead
                };
                await client.PutObjectAsync(request);
            }

            var extras = new List<ExtraDTO>();
            var extrasJson = Request.Form.Where(k => k.Key == "extras");
            foreach (var items in extrasJson)
            {
                foreach (var extra in items.Value.Select(item => item.FromJson<Extra>()))
                {
                    await _context.Extras.AddAsync(extra);
                    await _context.SaveChangesAsync();
                    var foodExtra = new FoodExtra(food.Id, extra.Id, restId);
                    await _context.FoodExtras.AddAsync(foodExtra);
                    extras.Add(new ExtraDTO(extra));
                }
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
