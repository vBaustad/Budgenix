export default function RecentActivity() {
  // In future: Replace with actual data or prop
  const activity = [
    { icon: '🛒', text: 'Added Grocery expense: 230 kr', time: '1 hour ago' },
    { icon: '💸', text: 'Income received: 12,000 kr', time: '2 days ago' },
    { icon: '🎯', text: "Updated Budget 'Entertainment'", time: '3 days ago' },
    { icon: '📈', text: 'Set new savings goal: Trip to Thailand', time: '5 days ago' },
  ];

  return (
    <div className="bg-base-100 border border-base-200 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <ul className="space-y-2 text-sm text-base-content/80">
        {activity.map((a, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span>{a.icon}</span>
            <span>{a.text}</span>
            <span className="ml-auto text-xs text-base-content/50">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
