using Budgenix.Dtos.BankStatements;
using Budgenix.Models.BankStatements;
using Budgenix.Services.BankStatements.Banks;
using Budgenix.Services.Learning;
using Budgenix.Helpers.BankStatements;
using Budgenix.Data;
using System.Globalization;
using System.Text.RegularExpressions;

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

        var lines = extractedText
            .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();

        // 1. Trim everything before and including "Saldo fra kontoutskrift"
        int startIdx = lines.FindIndex(l => l.Contains("Saldo fra kontoutskrift"));
        if (startIdx >= 0)
            lines = lines.Skip(startIdx + 1).ToList();

        // 2. Remove blocks from "Overført til neste side" to "Overført fra forrige side"
        for (int i = 0; i < lines.Count; i++)
        {
            if (lines[i].Contains("Overført til neste side"))
            {
                int resume = lines.FindIndex(i + 1, l => l.Contains("Overført fra forrige side"));
                if (resume != -1)
                {
                    lines.RemoveRange(i, resume - i + 1);
                    i--;
                }
                else
                {
                    lines = lines.Take(i).ToList();
                    break;
                }
            }
        }

        // 3. Trim everything after and including "Saldo i Deres favør"
        int endIdx = lines.FindIndex(l => l.Contains("Saldo i Deres favør"));
        if (endIdx >= 0)
            lines = lines.Take(endIdx).ToList();

        foreach (var line in lines)
        {
            var clean = line.Trim();

            if (clean.Length < 20)
                continue;

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

                if (!isIncome && string.IsNullOrEmpty(innRaw) && !string.IsNullOrEmpty(utRaw))
                {
                    if (TransactionCategorizer.IsLikelyIncome(description))
                    {
                        isIncome = true;
                        amountStr = utRaw;
                    }
                }

                if (string.IsNullOrEmpty(amountStr))
                    continue;

                var normalized = amountStr
                    .Replace(".", "")
                    .Replace(" ", "")
                    .Replace(",", ".");

                var amount = decimal.Parse(normalized, CultureInfo.InvariantCulture);
                var date = ParseDate(rentedatoRaw);

                var isInternalTransfer = TransactionCategorizer.IsInternalTransfer(description, userId, _context);
                var type = TransactionCategorizer.DetectType(description, isIncome);

                string? category = null;

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
                else if (isInternalTransfer)
                {
                    category = "Internal Transfer";
                }
                else
                {
                    category = TransactionCategorizer.GuessCategory(description);
                }

                transactions.Add(new ParsedTransactionDto
                {
                    Description = description,
                    Date = date,
                    Amount = amount,
                    IsIncome = isIncome,
                    TransactionType = type,
                    Category = category,
                    IsInternalTransfer = isInternalTransfer
                });
            }
            catch
            {
                // Log if needed
            }
        }

        return transactions;
    }

    private DateTime ParseDate(string rentedato)
    {
        return DateTime.ParseExact(rentedato + ".2025", "ddMM.yyyy", CultureInfo.InvariantCulture);
    }
}
