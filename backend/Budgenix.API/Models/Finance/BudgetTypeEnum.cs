using System.Text.Json.Serialization;

namespace Budgenix.Models.Finance
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BudgetTypeEnum
    {
        Spending,
        Saving
    }
}
