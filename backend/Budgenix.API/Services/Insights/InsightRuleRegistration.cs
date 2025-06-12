using Budgenix.Services.Insights.Rules;

namespace Budgenix.Services.Insights
{
    public static class InsightRuleRegistration
    {
        public static IServiceCollection AddInsightRules(this IServiceCollection services)
        {
            return services
                .AddScoped<IInsightRule, BudgetExceededRule>()
                .AddScoped<IInsightRule, BudgetUnderspentRule>()
                .AddScoped<IInsightRule, GoalProgressRule>()
                .AddScoped<IInsightRule, IncomeFluctuationRule>()
                .AddScoped<IInsightRule, LowIncomeCoverageRule>()
                .AddScoped<IInsightRule, LowIncomeWarningRule>()
                .AddScoped<IInsightRule, MultipleCategoryOverspendRule>()
                .AddScoped<IInsightRule, RecurringExpenseWarningRule>()
                .AddScoped<IInsightRule, SavingsGoalProgressRule>()
                .AddScoped<IInsightRule, SpendingUpRule>();
        }
    }

}
