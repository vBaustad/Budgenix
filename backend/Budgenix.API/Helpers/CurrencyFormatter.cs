public static class CurrencyFormatter
{
    public static string Format(decimal value, string currency)
    {
        return currency switch
        {
            "USD" => $"${value:N0}",
            "NOK" => $"{value:N0} kr",
            "EUR" => $"{value:N0} €",
            "GBP" => $"{value:N0} £",
            _ => $"{value:N0} {currency}"
        };
    }
}
