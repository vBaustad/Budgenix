using Budgenix.Data;
using Budgenix.Dtos.Learning;
using Budgenix.Models.BankStatements;
using Budgenix.Models.Learning;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Budgenix.Services.Learning;

public class TransactionCorrectionService : ITransactionCorrectionService
{
    private readonly BudgenixDbContext _context;

    public TransactionCorrectionService(BudgenixDbContext context)
    {
        _context = context;
    }

    private static string Normalize(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        return Regex.Replace(input.ToLowerInvariant().Trim(), @"[^\w\s]", "")
            .Replace("  ", " ")
            .Replace("nok", "")
            .Trim();
    }

    public async Task<TransactionCorrection?> MatchAsync(string userId, string description)
    {
        var corrections = await _context.TransactionCorrections
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var normalizedDescription = Normalize(description);

        return corrections
            .FirstOrDefault(x => normalizedDescription.Contains(Normalize(x.MatchText)));
    }

    public async Task SaveCorrectionAsync(string userId, string matchText, string category, bool? isIncome = null, BankTransactionType? type = null)
    {
        var entity = new TransactionCorrection
        {
            UserId = userId,
            MatchText = matchText,
            Category = category,
            IsIncome = isIncome,
            TransactionType = type,
            CreatedAt = DateTime.UtcNow
        };

        var exists = await _context.TransactionCorrections
            .AnyAsync(x =>
                x.UserId == userId &&
                x.MatchText == matchText &&
                x.Category == category &&
                x.IsIncome == isIncome &&
                x.TransactionType == type);

        if (exists)
            return;

        _context.TransactionCorrections.Add(entity);
        await _context.SaveChangesAsync();

        Console.WriteLine($"[Correction Saved] {userId}: '{matchText}' → {category}");
    }

    public async Task<List<TransactionCorrection>> GetCorrectionsForUserAsync(string userId)
    {
        return await _context.TransactionCorrections
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task<bool> UpdateCorrectionAsync(string userId, UpdateTransactionCorrectionDto dto)
    {
        var correction = await _context.TransactionCorrections
            .FirstOrDefaultAsync(x => x.Id == dto.Id && x.UserId == userId);

        if (correction == null)
            return false;

        correction.MatchText = dto.MatchText;
        correction.Category = dto.Category;
        correction.IsIncome = dto.IsIncome;
        correction.TransactionType = dto.TransactionType;

        await _context.SaveChangesAsync();
        return true;
    }


    public async Task<bool> DeleteCorrectionAsync(string userId, int id)
    {
        var correction = await _context.TransactionCorrections
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

        if (correction == null)
            return false;

        _context.TransactionCorrections.Remove(correction);
        await _context.SaveChangesAsync();
        return true;
    }

}
