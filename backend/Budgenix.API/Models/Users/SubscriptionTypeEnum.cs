using System.Text.Json.Serialization;

namespace Budgenix.Models.Users
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SubscriptionTypeEnum
    {
        Free,
        Hobby,
        Pro,
        ProPlus
    }
}
