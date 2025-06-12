using System.ComponentModel.DataAnnotations;

namespace Budgenix.Dtos.Shared
{
    public class UpdateCurrencyDto
    {
        [Required]
        [RegularExpression("^(USD|EUR|NOK|GBP)$", ErrorMessage = "Unsupported currency.")]
        public string Currency { get; set; }
    }

}
