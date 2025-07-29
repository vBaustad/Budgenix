using System.Globalization;
using System.Text.RegularExpressions;
using Budgenix.Models.BankStatements;
using Budgenix.Models.Learning;
using Budgenix.Data;
using Budgenix.Services.Learning;

namespace Budgenix.Helpers.BankStatements;

public static class TransactionCategorizer
{

    public static bool IsLikelyIncome(string description)
    {
        return description.Contains("Fra:", StringComparison.OrdinalIgnoreCase)
            || description.Contains("Kreditering", StringComparison.OrdinalIgnoreCase)
            || description.Contains("Skatteetaten", StringComparison.OrdinalIgnoreCase)
            || (description.Contains("Betalt:", StringComparison.OrdinalIgnoreCase)
                && !description.Contains("Til:", StringComparison.OrdinalIgnoreCase));
    }

    public static BankTransactionType DetectType(string description, bool isIncome)
    {
        if (description.Contains("Kreditering", StringComparison.OrdinalIgnoreCase))
            return BankTransactionType.Refund;

        if (description.Contains("Småsparing", StringComparison.OrdinalIgnoreCase))
            return BankTransactionType.Savings;

        if (Regex.IsMatch(description, @"\*\d{4}"))
            return BankTransactionType.CardPayment;

        if (description.Contains("Varer", StringComparison.OrdinalIgnoreCase))
            return BankTransactionType.Purchase;

        if (description.Contains("Til:", StringComparison.OrdinalIgnoreCase))
            return BankTransactionType.TransferOut;

        if (isIncome)
            return BankTransactionType.Income;

        return BankTransactionType.Unknown;
    }

    /// <summary>
    /// Determines whether a transaction is likely an internal transfer.
    /// Uses both user name patterns and known internal keywords.
    /// </summary>
    public static bool IsInternalTransfer(string? description, string userId, BudgenixDbContext context)
        {
            if (string.IsNullOrWhiteSpace(description))
                return false;

            var descLower = description.ToLowerInvariant();

            // Step 1: Keyword match
            var internalKeywords = new[]
            {
                "småsparing", "egen konto", "bufferkonto", "sparekonto",
                "intern overføring", "overført mellom egne kontoer"
            };

            if (internalKeywords.Any(k => descLower.Contains(k)))
                return true;

            // Step 2: User name match
            var user = context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.FirstName, u.LastName })
                .FirstOrDefault();

            if (user == null)
                return false;

            var first = user.FirstName?.ToLowerInvariant() ?? "";
            var last = user.LastName?.ToLowerInvariant() ?? "";

            var namePatterns = new[]
            {
                $"{first} {last}",
                $"{first[0]} {last}",
                $"{first} {last[0]}",
                $"{last}, {first}",
                $"{last} {first}"
            };

            var prefixKeywords = new[] { "fra:", "til:", "overført fra", "overført til" };

            foreach (var keyword in prefixKeywords)
            {
                foreach (var pattern in namePatterns)
                {
                    if (descLower.Contains(keyword) && descLower.Contains(pattern))
                        return true;
                }
            }

            return false;
        }

    public static string? GuessCategory(string description)
    {
        if (description.Contains("straksoverføring", StringComparison.OrdinalIgnoreCase))
            return "Transfers";

        if (description.Contains("fra:", StringComparison.OrdinalIgnoreCase))
            return "Income";

        if (description.Contains("kreditering", StringComparison.OrdinalIgnoreCase))
            return "Refund";

        // Paid via Vipps
        if (Regex.IsMatch(description, @"vipps\*\S+", RegexOptions.IgnoreCase))
        {
            foreach (var (keyword, category) in CategoryKeywordMap.Map)
            {
                if (MatchesKeyword(description, keyword))
                    return category;
            }
            return "Other";
        }

        foreach (var (keyword, category) in CategoryKeywordMap.Map)
        {
            if (MatchesKeyword(description, keyword))
                return category;
        }

        return null;
    }

    private static bool MatchesKeyword(string input, string keyword)
    {
        var lowerInput = input.ToLowerInvariant();
        var lowerKeyword = keyword.ToLowerInvariant();

        // Use Regex for risky short keywords
        if (keyword.Length <= 4 || keyword is "bar" or "cut" or "mat" or "hud" or "tax")
            return Regex.IsMatch(lowerInput, $@"\b{Regex.Escape(lowerKeyword)}\b");

        return lowerInput.Contains(lowerKeyword);
    }

    public static TransactionAnalysis Analyze(string description, string userId, BudgenixDbContext context)
    {
        var isIncome = IsLikelyIncome(description);
        var type = DetectType(description, isIncome);
        var category = GuessCategory(description);
        var internalTransfer = IsInternalTransfer(description, userId, context);

        return new TransactionAnalysis
        {
            Category = category,
            Type = type,
            IsIncome = isIncome,
            IsInternalTransfer = internalTransfer
        };
    }

}
