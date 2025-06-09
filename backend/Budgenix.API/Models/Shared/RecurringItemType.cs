using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models.Shared
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RecurringItemType
    {
        [Display(Name = "Income")]
        Income,

        [Display(Name = "Expense")]
        Expense
    }
}
