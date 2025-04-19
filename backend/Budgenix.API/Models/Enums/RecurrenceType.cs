using System.Text.Json.Serialization;

namespace Budgenix.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RecurrenceType
    {
        None,
        Daily,
        Weekly,
        Monthly,
        Yearly
    }
}
