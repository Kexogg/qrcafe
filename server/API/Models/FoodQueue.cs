namespace QrCafe.Models;

public class FoodQueueDTO
{
    public FoodQueueDTO(){}

    public FoodQueueDTO(FoodQueue foodQueue)
    {
        Id = foodQueue.Id;
        ClientId = foodQueue.ClientId;
        RestaurantId = foodQueue.RestaurantId;
        FoodId = foodQueue.FoodId;
        State = foodQueue.State;
        CreatedAt = foodQueue.CreatedAt;
    }

    public FoodQueueDTO(Guid clientId, int foodId, short state)
    {
        ClientId = clientId;
        FoodId = foodId;
        State = state;
    }
    
    public Guid? Id { get; set; }

    public Guid ClientId { get; set; }

    public int? RestaurantId { get; set; }

    public int FoodId { get; set; }

    public short State { get; set; }
    
    public TimeOnly? CreatedAt { get; set; }
}
public partial class FoodQueue
{
    public FoodQueue(){}

    public FoodQueue(FoodQueueDTO foodQueueDto, int restaurantId, Guid id, TimeOnly createdAt)
    {
        ClientId = foodQueueDto.ClientId;
        FoodId = foodQueueDto.FoodId;
        State = foodQueueDto.State;
        RestaurantId = restaurantId;
        Id = id;
        CreatedAt = createdAt;
    }

    public FoodQueue(Food food, Guid clientId, Guid id, TimeOnly createdAt)
    {
        Id = id;
        ClientId = clientId;
        RestaurantId = food.RestaurantId;
        FoodId = food.Id;
        State = 1;
        CreatedAt = createdAt;
    }
    public Guid Id { get; set; }

    public Guid ClientId { get; set; }

    public int RestaurantId { get; set; }

    public int FoodId { get; set; }

    public short State { get; set; }

    public TimeOnly CreatedAt { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Client Client { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Food Food { get; set; } = null!;

    [System.Text.Json.Serialization.JsonIgnore]
    public virtual Restaurant Restaurant { get; set; } = null!;
}
