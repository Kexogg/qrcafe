namespace QrCafe.Models;

public partial class Organization
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = null!;

    public string? ShortName { get; set; }

    public virtual ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
}
