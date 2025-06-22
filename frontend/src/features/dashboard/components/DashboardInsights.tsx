export default function DashboardInsights() {
  // In future: Replace with actual data or prop
  const insights = [
    "⚠️ You're 80% through your Groceries budget.",
    "💡 Set a savings goal for your trip to Thailand?",
    "📈 Your spending is up 12% from last month.",
  ];

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Insights</h2>
      <ul className="space-y-2 text-sm text-base-content/80">
        {insights.map((insight, idx) => (
          <li key={idx} className="hover:text-base-content transition">{insight}</li>
        ))}
      </ul>
    </div>
  );
}
