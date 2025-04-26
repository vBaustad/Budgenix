namespace Budgenix.Services
{
    public interface IUserService
    {
        string GetUserId();
        string? GetUserEmail(); // Optional: handy for logging or extra info
    }
}
