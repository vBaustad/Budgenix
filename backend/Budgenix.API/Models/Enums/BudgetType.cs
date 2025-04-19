using System.Text.Json.Serialization;

namespace Budgenix.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BudgetType
    {
        Fixed,
        Flexible,
        Savings,
        Goal
    }
}
