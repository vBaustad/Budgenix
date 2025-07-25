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

            // Fuel
            { "circle k", "Fuel" },
            { "esso", "Fuel" },
            { "shell", "Fuel" },
            { "uno-x", "Fuel" },

            // Dining Out
            { "mcdonalds", "Dining Out" },
            { "peppes", "Dining Out" },
            { "wolt", "Dining Out" },
            { "foodora", "Dining Out" },
            { "subway", "Dining Out" },
            { "kebab", "Dining Out" },
            { "burger", "Dining Out" },

            // Subscriptions
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

            // Utilities
            { "telenor", "Utilities" },
            { "telia", "Utilities" },
            { "lyse", "Utilities" },
            { "elvia", "Utilities" },
            { "bkk", "Utilities" },
            { "fortum", "Utilities" },
            { "norgesenergi", "Utilities" },

            // Household
            { "clas ohlson", "Household" },
            { "jysk", "Household" },
            { "ikea", "Household" },

            // Clothing
            { "h&m", "Clothing" },
            { "zara", "Clothing" },
            { "cubus", "Clothing" },
            { "dressmann", "Clothing" },

            // Health
            { "boots", "Health" },
            { "apotek", "Health" },
            { "vitusapotek", "Health" },
            { "lege", "Health" },

            // Personal Care
            { "frisør", "Personal Care" },
            { "cutters", "Personal Care" },
            { "barber", "Personal Care" },
            { "hudpleie", "Personal Care" },

            // Transportation
            { "vy", "Transportation" },
            { "ruter", "Transportation" },
            { "nsb", "Transportation" },
            { "taxi", "Transportation" },
            { "finn reise", "Transportation" },

            // Entertainment
            { "ticketmaster", "Entertainment" },
            { "eventim", "Entertainment" },
            { "kino", "Entertainment" },
            { "game", "Entertainment" },
            { "crunchyroll", "Entertainment" },

            // Pets
            { "dyrebutikk", "Pets" },
            { "buddy", "Pets" },
            { "musti", "Pets" },
            { "veterinær", "Pets" },

            // Gifts & Donations
            { "gaver", "Gifts & Donations" },
            { "donasjon", "Gifts & Donations" },
            { "røde kors", "Gifts & Donations" },
            { "redd barna", "Gifts & Donations" },

            // Vacation
            { "airbnb", "Vacation" },
            { "tui", "Vacation" },
            { "norwegian", "Vacation" },
            { "sas", "Vacation" },
            { "hotel", "Vacation" },

            // Rent
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

            // Shopping
            { "temu", "Shopping" },
            { "aliexpress", "Shopping" },
            { "cdon", "Shopping" },

            // Electronics
            { "elkjøp", "Electronics" },
            { "power", "Electronics" },
            { "komplett", "Electronics" },

            // Gaming
            { "steam", "Gaming" },
            { "xbox", "Gaming" },
            { "playstation", "Gaming" },

            // Software
            { "microsoft", "Software" }
        };
    }
}
