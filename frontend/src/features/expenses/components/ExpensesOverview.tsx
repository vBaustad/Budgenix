export default function ExpensesOverview() {
    return (
      <div>
        {/* Placeholder content */}
        <p className="text-base-content/70 text-sm">Total spent: ...</p>        
        <h3 className="text-lg text-success font-semibold">$1,492.00</h3>
        <p>Upcoming expenses: ...</p>
        <div className="bg-primary/10 rounded-xl p-4 border border-base-200 shadow-md">
          <h4 className="text-md font-semibold mb-2">💡 Insight</h4>
          <p className="text-sm text-base-content/70">
            You're spending $500/month on recurring bills. Consider reviewing categories like “Subscriptions” and “Utilities”.
          </p>
        </div>
      </div>
    )
  }
  