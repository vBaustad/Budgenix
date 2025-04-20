using System.Text.Json.Serialization;

namespace Budgenix.Models.Budgeting
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BudgetTypeEnum
    {
        Spending,
        Saving
    }
}
