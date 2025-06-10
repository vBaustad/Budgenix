import {
  PlusIcon,
  TrendingUpIcon,
  WalletIcon,
  PiggyBankIcon,
  CalendarIcon,
  TargetIcon,
  SparklesIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const cards = [
    {
      title: 'Expenses This Month',
      value: 14200,
      suffix: 'kr',
      icon: <WalletIcon className="w-6 h-6 text-red-400" />,
      to: '/expenses',
      bg: 'from-red-500/50 to-red-900/70',
      border: 'border-red-500/20',
      progress: 82,
    },
    {
      title: 'Income Received',
      value: 23500,
      suffix: 'kr',
      icon: <TrendingUpIcon className="w-6 h-6 text-green-400" />,
      to: '/income',
      bg: 'from-green-500/50 to-green-900/70',
      border: 'border-green-500/20',
      progress: 100,
    },
    {
      title: 'Active Budgets',
      value: 5,
      suffix: 'Active',
      icon: <CalendarIcon className="w-6 h-6 text-blue-400" />,
      to: '/budgets',
      bg: 'from-blue-500/50 to-blue-900/70',
      border: 'border-blue-500/20',
      progress: 60,
    },
    {
      title: 'Savings Total',
      value: 68000,
      suffix: 'kr',
      icon: <PiggyBankIcon className="w-6 h-6 text-orange-300" />,
      to: '/goals',
      bg: 'from-orange-500/50 to-orange-900/70',
      border: 'border-orange-500/20',
      progress: 74,
    },
    {
      title: 'Financial Goals',
      value: 3,
      suffix: 'Goals',
      icon: <TargetIcon className="w-6 h-6 text-pink-400" />,
      to: '/goals',
      bg: 'from-pink-500/50 to-pink-900/70',
      border: 'border-pink-500/20',
      progress: 30,
    },
  ];

  const [animatedValues, setAnimatedValues] = useState(cards.map(() => 0));

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedValues((prev) =>
          prev.map((val, i) => {
            const target = cards[i].value;
            const diff = target - val;
            if (Math.abs(diff) < 100) return target;
            return val + diff * 0.2;
          })
        );
      }, 50);
      return () => clearInterval(interval);
    }, 300); // delay before animation starts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header with user context */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-base-content">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold">Welcome back, Vebjørn 👋</h1>
            <p className="text-lg mt-1 text-base-content/70">
              Here's what's happening in your finances today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm opacity-80">
            <span className="font-medium">Monday</span>, June 9 — 2 budgets near limit
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Link
              key={card.title}
              to={card.to}
              className={`group p-6 rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} shadow-lg hover:shadow-xl transition-transform hover:scale-105`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-white/80 rounded-full">{card.icon}</div>
                <h3 className="text-xl font-semibold">{card.title}</h3>
              </div>
              <div className="text-3xl font-bold mb-1">
                {Math.round(animatedValues[i]).toLocaleString()} {card.suffix}
              </div>
              <div className="w-full h-2 mt-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 transition-all duration-700"
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-base-content mt-2 group-hover:text-white/90 transition">
                Tap to view details →
              </div>
            </Link>
          ))}
        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          <div className="bg-white/10 p-4 rounded-xl text-base-content shadow hover:shadow-lg transition">
            ⚠️ You're 80% through your groceries budget.
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-base-content shadow hover:shadow-lg transition">
            💡 Set a savings goal for that upcoming trip to Thailand?
          </div>
        </div>

        {/* Quick Add Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <button className="btn btn-primary w-full justify-center gap-2 hover:shadow-[0_0_16px_#3b82f6aa]">
            <PlusIcon className="w-5 h-5" />
            Add Expense
          </button>
          <button className="btn btn-accent w-full justify-center gap-2 hover:shadow-[0_0_16px_#22d3eeaa]">
            <PlusIcon className="w-5 h-5" />
            Add Income
          </button>
          <button className="btn btn-secondary w-full justify-center gap-2 hover:shadow-[0_0_16px_#9333ea99]">
            <PlusIcon className="w-5 h-5" />
            Add Budget
          </button>
          <button className="btn btn-info w-full justify-center gap-2 hover:shadow-[0_0_16px_#f472b6aa] text-white">
            <PlusIcon className="w-5 h-5" />
            Add Goal
          </button>
        </div>

        {/* Recent Activity */}
        <div className="pt-10 space-y-4">
          <h2 className="text-xl font-semibold text-base-content">Recent Activity</h2>
          <ul className="space-y-2 text-sm text-base-content/80">
            <li>🛒 Added Grocery expense: 230 kr — 1 hour ago</li>
            <li>💸 Income received: 12,000 kr — 2 days ago</li>
            <li>🎯 Updated Budget 'Entertainment' — 3 days ago</li>
            <li>📈 Set new savings goal: Trip to Thailand — 5 days ago</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center pt-10 opacity-80">
          <SparklesIcon className="inline w-6 h-6 text-base-content animate-ping-slow mr-2" />
          Budget with vision. Spend with power. Save with purpose.
        </div>
      </div>
    </div>
  );
}
