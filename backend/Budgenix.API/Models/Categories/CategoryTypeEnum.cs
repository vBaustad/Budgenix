using System.Text.Json.Serialization;

namespace Budgenix.Models.Categories
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CategoryTypeEnum
    {
        Expense,
        Income,
        Both
    }
}
