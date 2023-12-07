namespace QrCafe.Models;

public partial class FoodQueue
{
    public Guid Id { get; set; }

    public Guid ClientId { get; set; }

    public int RestaurantId { get; set; }

    public int FoodId { get; set; }

    public short State { get; set; }

    public TimeOnly CreatedAt { get; set; }

    public virtual Client Client { get; set; } = null!;

    public virtual Food Food { get; set; } = null!;

    public virtual Restaurant Restaurant { get; set; } = null!;
}
