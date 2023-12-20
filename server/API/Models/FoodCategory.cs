using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QrCafe.Models;

public partial class FoodCategory
{
    public int FoodId;
    
    public int CategoryId;

    public virtual Food Food { get; set; } = null!;

    public virtual Category Category { get; set; } = null!;
}