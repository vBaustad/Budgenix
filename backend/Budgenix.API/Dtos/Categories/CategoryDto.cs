using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Categories
{
    public class CategoryDto : Controller
    {
        public Guid Id { get; set; }
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }
    }
}
