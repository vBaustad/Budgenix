// Mapping/Resolvers/NextOccurrenceResolver.cs
using AutoMapper;
using Budgenix.Dtos.Recurring;
using Budgenix.Models.Finance;
using Budgenix.Services.Recurring;

public class NextOccurrenceResolver : IValueResolver<RecurringItem, RecurringItemDto, DateTime?>
{
    private readonly RecurringItemService _service;

    public NextOccurrenceResolver(RecurringItemService service)
    {
        _service = service;
    }

    public DateTime? Resolve(RecurringItem source, RecurringItemDto destination, DateTime? destMember, ResolutionContext context)
    {
        return _service.GetNextOccurrenceDate(source, source.StartDate);
    }
}
