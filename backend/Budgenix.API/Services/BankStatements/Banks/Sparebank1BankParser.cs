using Budgenix.Dtos.BankStatements;
using Budgenix.Models.BankStatements;
using Budgenix.Models.Categories;
using Budgenix.Services.BankStatements.Banks;
using Budgenix.Services.Learning;
using System.Globalization;
using System.Text.RegularExpressions;
using Budgenix.Models.Learning;
using Budgenix.Data;

public class Sparebank1BankParser : IBankStatementParser
{
    private readonly ITransactionCorrectionService _correctionService;
    private readonly BudgenixDbContext _context;

    public Sparebank1BankParser(ITransactionCorrectionService correctionService, BudgenixDbContext context)
    {
        _correctionService = correctionService;
        _context = context;
    }

    public async Task<List<ParsedTransactionDto>> ParseAsync(string extractedText, string userId)
    {
        var transactions = new List<ParsedTransactionDto>();

        var lines = extractedText.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

        // 1. Trim everything before and including "Saldo fra kontoutskrift"
        int startIdx = lines.FindIndex(l => l.Contains("Saldo fra kontoutskrift"));
        if (startIdx >= 0)
            lines = lines.Skip(startIdx + 1).ToList(); // +1 to exclude the match itself

        // 2. Remove blocks from "Overført til neste side" to "Overført fra forrige side"
        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("Overført til neste side"))
            {
                int resume = lines.FindIndex(i + 1, l => l.Contains("Overført fra forrige side"));
                if (resume != -1)
                {
                    lines.RemoveRange(i, resume - i + 1); // includes both lines
                    i--; // step back to recheck same index
                }
                else
                {
                    // If no "Overført fra forrige side", just remove the rest
                    lines = lines.Take(i).ToList();
                    break;
                }
            }
        }

        // 3. Trim everything after and including "Saldo i Deres favør"
        int endIdx = lines.FindIndex(l => l.Contains("Saldo i Deres favør"));
        if (endIdx >= 0)
            lines = lines.Take(endIdx).ToList(); // exclude the line itself



        string? category = null;

        foreach (var line in lines)
        {
            var clean = line.Trim();
                        
            // Skip if too short
            if (clean.Length < 20)
                continue;

            // Match the structure: description + rentedato + ut + inn + bokfort
            var match = Regex.Match(clean,
                @"^(?<desc>.+?)\s+(?<rentedato>\d{4})\s+(?:(?<utavkonto>\d{1,3}(?:[. ]\d{3})*,\d{2})\s+)?(?:(?<innpakonto>\d{1,3}(?:[. ]\d{3})*,\d{2})\s+)?(?<bokfort>\d{4})$");

            if (!match.Success)
                continue;

            try
            {
                var description = match.Groups["desc"].Value.Trim();
                var rentedatoRaw = match.Groups["rentedato"].Value;
                var utRaw = match.Groups["utavkonto"].Success ? match.Groups["utavkonto"].Value : null;
                var innRaw = match.Groups["innpakonto"].Success ? match.Groups["innpakonto"].Value : null;

                var isIncome = !string.IsNullOrEmpty(innRaw);
                var amountStr = isIncome ? innRaw : utRaw;

                // If no inn field matched but the description indicates income, override
                if (!isIncome && string.IsNullOrEmpty(innRaw) && !string.IsNullOrEmpty(utRaw))
                {
                    if (IsLikelyIncome(description))
                    {
                        isIncome = true;
                        amountStr = utRaw;
                    }
                }

                var isInternalTransfer = IsInternalTransfer(description, userId);


                if (string.IsNullOrEmpty(amountStr))
                    continue; // If neither ut nor inn is populated, skip

                var normalized = amountStr
                    .Replace(".", "")   // remove thousands separator
                    .Replace(" ", "")   // just in case
                    .Replace(",", "."); // convert decimal

                var amount = decimal.Parse(normalized, CultureInfo.InvariantCulture);

                var date = ParseDate(rentedatoRaw);
                var type = DetectType(description, isIncome);

                var correction = await _correctionService.MatchAsync(userId, description);

                if (correction != null)
                {
                    if (!string.IsNullOrEmpty(correction.Category))
                        category = correction.Category;

                    if (correction.IsIncome.HasValue)
                        isIncome = correction.IsIncome.Value;

                    if (correction.TransactionType.HasValue)
                        type = correction.TransactionType.Value;
                }
                else
                {                 
                    category = GuessCategory(description.ToLower());
                }



                transactions.Add(new ParsedTransactionDto
                {
                    Description = description,
                    Date = date,
                    Amount = amount,
                    IsIncome = isIncome,
                    TransactionType = type,
                    Category = category,
                    IsInternalTransfer = isInternalTransfer,
                    
                });

            }
            catch
            {
                // Optionally log or collect failed lines
            }
        }

        return transactions;
    }

    private DateTime ParseDate(string rentedato)
    {
        return DateTime.ParseExact(rentedato + ".2025", "ddMM.yyyy", CultureInfo.InvariantCulture);
    }

    private bool IsLikelyIncome(string description)
    {
        return description.Contains("Fra:", StringComparison.OrdinalIgnoreCase)
            || description.Contains("Kreditering", StringComparison.OrdinalIgnoreCase)
            || description.Contains("Skatteetaten", StringComparison.OrdinalIgnoreCase)
            || (description.Contains("Betalt:", StringComparison.OrdinalIgnoreCase)
                && !description.Contains("Til:", StringComparison.OrdinalIgnoreCase));
    }

    private BankTransactionType DetectType(string description, bool isIncome)
    {
        if (description.Contains("Kreditering", StringComparison.OrdinalIgnoreCase)) return BankTransactionType.Refund;
        if (description.Contains("Småsparing", StringComparison.OrdinalIgnoreCase)) return BankTransactionType.Savings;
        if (Regex.IsMatch(description, @"\*\d{4}")) return BankTransactionType.CardPayment;
        if (description.Contains("Varer", StringComparison.OrdinalIgnoreCase)) return BankTransactionType.Purchase;
        if (description.Contains("Til:", StringComparison.OrdinalIgnoreCase)) return BankTransactionType.TransferOut;
        if (isIncome) return BankTransactionType.Income;

        return BankTransactionType.Unknown;
    }

    private bool IsInternalTransfer(string? description, string userId)
    {
        if (string.IsNullOrWhiteSpace(description))
            return false;

        var user = _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.FirstName, u.LastName })
            .FirstOrDefault();

        if (user == null)
            return false;

        var descriptionLower = description.ToLowerInvariant();
        var first = user.FirstName?.ToLowerInvariant() ?? "";
        var last = user.LastName?.ToLowerInvariant() ?? "";

        // Match full name, or variations like "fra: v Baustad", etc.
        var namePatterns = new[]
        {
        $"{first} {last}",
        $"{first[0]} {last}",
        $"{first} {last[0]}",
        $"{last}, {first}",
        $"{last} {first}",
    };

        var prefixKeywords = new[]
        {
        "fra:",
        "til:",
        "overført fra",
        "overført til"
    };

        foreach (var keyword in prefixKeywords)
        {
            foreach (var pattern in namePatterns)
            {
                if (descriptionLower.Contains(keyword) && descriptionLower.Contains(pattern))
                    return true;
            }
        }

        return false;
    }


    private string? GuessCategory(string description)
    {
        // Explicit transfers
        if (description.Contains("straksoverføring", StringComparison.OrdinalIgnoreCase))
            return "Transfers";

        if (description.Contains("fra:", StringComparison.OrdinalIgnoreCase))
            return "Income";

        if (description.Contains("kreditering", StringComparison.OrdinalIgnoreCase))
            return "Refund";

        // Paid through Vipps app — treat as normal purchase
        if(Regex.IsMatch(description, @"vipps\*\S+", RegexOptions.IgnoreCase))
        {
            // Continue to try keyword matches
            foreach (var (keyword, category) in CategoryKeywordMap.Map)
            {
                if (description.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                    return category;
            }
            return "Other";
        }

        // General keyword matching
        foreach (var (keyword, category) in CategoryKeywordMap.Map)
        {
            if (description.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                return category;
        }

        return null;
    }

}
