using System.Text.Json.Serialization;

namespace Budgenix.Dtos.Recurring
{
    public class UpcomingRecurringDto
    {
        [JsonPropertyName("nextDate")]
        public string NextDate { get; set; } = string.Empty;

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }
    }


}
