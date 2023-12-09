namespace QrCafe.Models;

public class OrganizationDTO
{
    public OrganizationDTO(Organization organization)
    {
        Id = organization.Id;
        FullName = organization.FullName;
        ShortName = organization.ShortName;
    }
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string? ShortName { get; set; }
}
public partial class Organization
{
    public Organization() {}
    
    public Organization(string fullName, string shortName, QrCafeDbContext db)
    {
        Id = db.Organizations.Count();
        FullName = fullName;
        ShortName = shortName;
    }
    public Organization(OrganizationDTO organizationDto)
    {
        Id = organizationDto.Id;
        FullName = organizationDto.FullName;
        ShortName = organizationDto.ShortName;
    }
    
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string? ShortName { get; set; }

    public virtual ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
}
