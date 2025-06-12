using Budgenix.Models.Shared;

namespace Budgenix.Helpers
{
    public static class RecurrenceHelper
    {
        public static (DateTime start, DateTime end) GetRecurrencePeriod(DateTime now, RecurrenceTypeEnum recurrence)
        {
            switch (recurrence)
            {
                case RecurrenceTypeEnum.Daily:
                    return (now.Date, now.Date);

                case RecurrenceTypeEnum.Weekly:
                    var weekStart = StartOfWeek(now);
                    return (weekStart, weekStart.AddDays(6));

                case RecurrenceTypeEnum.BiWeekly:
                    var biStart = StartOfWeek(now).AddDays(-7);
                    return (biStart, biStart.AddDays(13));

                case RecurrenceTypeEnum.Monthly:
                    var monthStart = new DateTime(now.Year, now.Month, 1);
                    return (monthStart, monthStart.AddMonths(1).AddDays(-1));

                case RecurrenceTypeEnum.Quarterly:
                    int quarterStartMonth = ((now.Month - 1) / 3) * 3 + 1;
                    var quarterStart = new DateTime(now.Year, quarterStartMonth, 1);
                    return (quarterStart, quarterStart.AddMonths(3).AddDays(-1));

                case RecurrenceTypeEnum.Yearly:
                    return (new DateTime(now.Year, 1, 1), new DateTime(now.Year, 12, 31));

                default:
                    return (DateTime.MinValue, DateTime.MaxValue);
            }
        }


        private static DateTime StartOfWeek(DateTime dt) =>
                dt.AddDays(-(int)dt.DayOfWeek).Date;
    }

}
