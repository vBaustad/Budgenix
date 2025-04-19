using Budgenix.Models;

namespace Budgenix.Data
{
    public static class SeedData
    {
        public static void Initialize(BudgenixDbContext context)
        {
            if (context.Categories.Any())
                return; //Already seeded

            var defaultCategories = DefaultCategories.GetAll();
            context.Categories.AddRange(defaultCategories);
            context.SaveChanges();
        }
    }
}
