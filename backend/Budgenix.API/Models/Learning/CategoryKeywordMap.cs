namespace Budgenix.Models.Learning
{
    public static class CategoryKeywordMap
    {
        public static readonly Dictionary<string, string> Map = new(StringComparer.OrdinalIgnoreCase)
        {
            // Groceries
            { "rema", "Groceries" }, 
            { "kiwi", "Groceries" }, 
            { "extra", "Groceries" }, 
            { "meny", "Groceries" },
            { "coop", "Groceries" }, 
            { "obs", "Groceries" }, 
            { "bunnpris", "Groceries" }, 
            { "joker", "Groceries" },
            { "mat", "Groceries" }, 
            { "matbutikk", "Groceries" }, 
            { "frukt", "Groceries" }, 
            { "spar", "Groceries" },

            // Fuel
            { "circle k", "Fuel" }, 
            { "esso", "Fuel" }, 
            { "shell", "Fuel" }, 
            { "uno-x", "Fuel" },
            { "st1", "Fuel" }, 
            { "yx", "Fuel" },

            // Dining & Nightlife
            { "mcdonalds", "Dining" }, 
            { "peppes", "Dining" }, 
            { "wolt", "Dining" }, 
            { "foodora", "Dining" },
            { "subway", "Dining" }, 
            { "kebab", "Dining" }, 
            { "burger", "Dining" }, 
            { "pizza", "Dining" },
            { "grill", "Dining" }, 
            { "grillen", "Dining" }, 
            { "gatekjø", "Dining" }, 
            { "bar", "Dining" },
            { "sushi", "Dining" }, 
            { "kfc", "Dining" }, 
            { "egon", "Dining" }, 
            { "pizzabakeren", "Dining" },
            { "restaurant", "Dining" },

            // Subscriptions & Media
            { "spotify", "Subscriptions" }, 
            { "netflix", "Subscriptions" }, 
            { "viaplay", "Subscriptions" },
            { "hbo", "Subscriptions" }, 
            { "disney", "Subscriptions" }, 
            { "apple.com", "Subscriptions" },
            { "google", "Subscriptions" }, 
            { "suno", "Subscriptions" }, 
            { "adobe", "Subscriptions" },
            { "linkedin", "Subscriptions" }, 
            { "openai", "Subscriptions" }, 
            { "notion", "Subscriptions" },

            // Utilities
            { "telenor", "Utilities" }, 
            { "telia", "Utilities" }, 
            { "lyse", "Utilities" }, 
            { "elvia", "Utilities" },
            { "bkk", "Utilities" }, 
            { "fortum", "Utilities" }, 
            { "norgesenergi", "Utilities" },

            // Household Supplies
            { "clas ohlson", "Furnishings" }, 
            { "clas oh", "Furnishings" }, 
            { "jysk", "Furnishings" },
            { "ikea", "Furnishings" }, 
            { "mester grønn", "Furnishings" }, 
            { "plantasjen", "Furnishings" },
            { "planteland", "Furnishings" }, 
            { "fargerike", "Furnishings" }, 
            { "byggmakker", "Furnishings" },
            { "maxbo", "Furnishings" }, 
            { "montér", "Furnishings" }, 
            { "byggmax", "Furnishings" },
            { "xl-bygg", "Furnishings" },

            // Clothing
            { "h&m", "Clothing" }, 
            { "zara", "Clothing" }, 
            { "cubus", "Clothing" }, 
            { "dressmann", "Clothing" },
            { "zalando", "Clothing" },

            // Health
            { "boots", "Medical" }, 
            { "apotek", "Medical" }, 
            { "vitusapotek", "Medical" },
            { "lege", "Medical" }, 
            { "spinnvill", "Wellness" }, 
            { "sats", "Gym" }, 
            { "trening", "Gym" },

            // Grooming
            { "frisør", "Grooming" }, 
            { "cutters", "Grooming" }, 
            { "barber", "Grooming" },
            { "hudpleie", "Grooming" }, 
            { "nikita", "Grooming" }, 
            { "the body shop", "Grooming" },

            // Transportation
            { "vy", "Public Transport" }, 
            { "ruter", "Public Transport" }, 
            { "nsb", "Public Transport" },
            { "taxi", "Public Transport" }, 
            { "finn reise", "Public Transport" },
            { "easypark", "Parking" }, 
            { "autopass", "Parking" }, 
            { "onepark", "Parking" },
            { "apcoa", "Parking" }, 
            { "bolt.eu", "Public Transport" }, 
            { "voitechnolo", "Public Transport" },
            { "ryde", "Public Transport" },

            // Entertainment
            { "ticketmaster", "Entertainment" }, 
            { "eventim", "Entertainment" }, 
            { "kino", "Entertainment" },
            { "game", "Entertainment" }, 
            { "crunchyroll", "Entertainment" },
            { "steam", "Entertainment" }, 
            { "xbox", "Entertainment" }, 
            { "playstation", "Entertainment" },
            { "epic games", "Entertainment" }, 
            { "battlenet", "Entertainment" }, 
            { "riot games", "Entertainment" },

            // Pets
            { "dyrebutikk", "Pets" }, 
            { "buddy", "Pets" }, 
            { "musti", "Pets" }, 
            { "veterinær", "Pets" },

            // Gifts & Donations
            { "gaver", "Gifts" }, 
            { "donasjon", "Donations" }, 
            { "røde kors", "Donations" },
            { "redd barna", "Donations" },

            // Travel
            { "airbnb", "Travel" }, 
            { "tui", "Travel" }, 
            { "norwegian", "Travel" },
            { "sas", "Travel" }, 
            { "hotel", "Travel" }, 
            { "booking.com", "Travel" },
            { "hotels.com", "Travel" }, 
            { "ryanair", "Travel" },

            // Housing
            { "husleie", "Rent" }, 
            { "utleie", "Rent" }, 
            { "boligutleie", "Rent" },

            // Insurance
            { "gjensidige", "Insurance" }, 
            { "if", "Insurance" }, 
            { "tryg", "Insurance" },
            { "fremtind", "Insurance" },

            // Education
            { "student", "Education" }, 
            { "studielån", "Education" }, 
            { "sio", "Education" }, 
            { "lån", "Education" },

            // Shopping
            { "temu", "Shopping" }, 
            { "aliexpress", "Shopping" }, 
            { "cdon", "Shopping" },
            { "wish", "Shopping" }, 
            { "amazon", "Shopping" }, 
            { "etsy", "Shopping" }, 
            { "alipay", "Shopping" },

            // Electronics
            { "elkjøp", "Electronics" }, 
            { "elkjop", "Electronics" }, 
            { "elkjoep", "Electronics" },
            { "power", "Electronics" }, 
            { "komplett", "Electronics" },

            // Software & Tools
            { "microsoft", "Software" }, 
            { "figma", "Software" },

            // Other Income
            //{ "skatteetaten", "Gift Income" }, 
            //{ "nav", "Gift Income" },
            //{ "statens innkrevingssentral", "Gift Income" },

            // Bank Fees
            { "gebyr", "Bank Fees" }, 
            { "rente", "Bank Fees" }, 
            { "overtrekk", "Bank Fees" },
            { "valutapåslag", "Bank Fees" },

            // Cash Withdrawal
            { "minibank", "Cash Withdrawal" }, 
            { "kontantuttak", "Cash Withdrawal" },

            // Internal Transfer
            { "småsparing", "Internal Transfer" }, 
            { "egen konto", "Internal Transfer" },
            { "bufferkonto", "Internal Transfer" }, 
            { "sparekonto", "Internal Transfer" },
            { "intern overføring", "Internal Transfer" }, 
            { "overført mellom egne kontoer", "Internal Transfer" }
        };
    }
}
