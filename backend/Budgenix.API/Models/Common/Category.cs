using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public required string Name { get; set; }

        public required CategoryType Type { get; set; }

        public string? ColorHex { get; set; } // Optional: for UI badges/tags (e.g. "#FF9900")
        [StringLength(500)]
        public string? Notes { get; set; } 
        public bool IsUserDefined { get; set; }

    }
}
