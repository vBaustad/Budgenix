using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace Budgenix.Models.Shared
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RecurrenceTypeEnum
    {
        None,

        [Display(Name = "Daily")]
        Daily,

        [Display(Name = "Weekly")]
        Weekly,

        [Display(Name = "Bi-Weekly")]
        BiWeekly,

        [Display(Name = "Monthly")]
        Monthly,

        [Display(Name = "Quarterly")]
        Quarterly,

        [Display(Name = "Yearly")]
        Yearly
    }
}
