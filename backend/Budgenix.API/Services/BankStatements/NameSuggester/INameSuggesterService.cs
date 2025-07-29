namespace Budgenix.Services.BankStatements.NameSuggester
{
    public interface INameSuggesterService
    {
        Task<string> SuggestNameAsync(string description);
    }
}
