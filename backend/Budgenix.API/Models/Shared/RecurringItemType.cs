using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models.Shared
{
    /// <summary>
    /// Defines the type of a recurring item: Income or Expense.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RecurringItemType
    {
        [Display(Name = "Income")]
        Income = 0,

        [Display(Name = "Expense")]
        Expense = 1
    }
}
