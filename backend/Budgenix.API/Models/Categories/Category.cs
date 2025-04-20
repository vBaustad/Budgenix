using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models.Categories
{
    public class Category
    {
        public Guid Id { get; set; }

        [Required, StringLength(100)]
        public required string Name { get; set; }

        public required CategoryTypeEnum Type { get; set; }

        public string? ColorHex { get; set; } // Optional: for UI badges/tags (e.g. "#FF9900")
        [StringLength(500)]
        public string? Notes { get; set; } 
        public bool IsUserDefined { get; set; }

    }
}
