using System.Text.Json.Serialization;

namespace Budgenix.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CategoryType
    {
        Expense,
        Income,
        Both
    }
}
