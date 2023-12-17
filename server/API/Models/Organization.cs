namespace QrCafe.Models;

public class OrganizationDTO
{
    public OrganizationDTO(){}

    public OrganizationDTO(string fullName, string shortName)
    {
        FullName = fullName;
        ShortName = shortName;
    }
    public OrganizationDTO(Organization organization)
    {
        Id = organization.Id;
        FullName = organization.FullName;
        ShortName = organization.ShortName;
    }
        public int? Id { get; set; }

        public string FullName { get; set; } = null!;

        public string? ShortName { get; set; }
}
public partial class Organization
{
    public Organization() {}

    public Organization(OrganizationDTO organizationDto, int orgId)
    {
        Id = orgId;
        FullName = organizationDto.FullName;
        ShortName = organizationDto.ShortName;
    }
    
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string? ShortName { get; set; }

    public virtual ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
}
