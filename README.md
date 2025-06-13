# 💰 Budgenix 

**Budgenix** is a modern personal finance app designed to help you track spending, manage income, plan budgets, and achieve financial goals — all with clarity, speed, and insight. Whether you're solo or managing a household, Budgenix is built to scale.

---

## 🚀 Tech Stack

| Layer       | Technology                |
|-------------|--------------------------|
| Frontend    | React + TypeScript + Vite |
| Styling     | Tailwind CSS + DaisyUI    |
| Charts      | Recharts                  |
| Backend     | ASP.NET Core Web API (C#) |
| ORM         | Entity Framework Core     |
| Database    | SQLite (local dev)        |
| Auth        | JWT + ASP.NET Identity    |
| Testing     | xUnit (.NET)              |

---

## 📦 Core Features

- 🔁 **Recurring items** for both income and expenses
- 📊 **Dynamic dashboards** with real-time charts, stats, and insights
- 🧠 **Smart insights** (e.g. spending spikes, savings stall, low income coverage)
- 📆 **Flexible grouping** (by month, year, or category)
- 💸 **User currency preferences** with inline formatting and live updates
- 🎯 **Category budgets** with progress tracking
- 🌟 **Savings goals** (targets, wishlists, planners)
- 🧩 **Modular architecture** (React + ASP.NET Core)
- 🌍 **Responsive UI** with dark/light mode
- 📈 **Rich data visualizations** (bar, pie, trend charts)

---

## 🔐 Auth & User System

- Secure JWT login/signup/logout
- ASP.NET Identity for user management
- User-based settings (currency, preferences)
- Tier access (Free / Pro / Pro+ coming soon)
- Household sharing + multi-user roles (planned)

---

## 🛠 API Overview

### Expenses
- `GET /api/expenses`
- `GET /api/expenses?groupBy=month|year|category`
- `GET /api/expenses/overview?month=&year=`
- `POST /api/expenses`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

### Incomes
- `GET /api/incomes`
- `GET /api/incomes/overview?month=&year=`
- `GET /api/incomes/summary?months=6`
- `POST /api/incomes`
- `PUT /api/incomes/{id}`
- `DELETE /api/incomes/{id}`

### Recurring
- `GET /api/recurring/upcoming`
- `POST /api/recurring`
- `PUT /api/recurring/{id}`
- `DELETE /api/recurring/{id}`
- `POST /api/recurring/{id}/trigger`
- `POST /api/recurring/{id}/skip`

### Budgets
- Category-based budgets
- Allocations + progress

### Insights
- API-driven dynamic suggestions (e.g. spending spikes, budget near limits)

---

## 💻 Frontend Highlights

- 🔗 **Context-driven architecture**
  - `ExpensesContext`, `IncomesContext`, `CurrencyContext`, `UserContext`, `RecurringContext`, `DateFilterContext`
- 📊 **Dashboard**
  - Stat cards, progress bars, insights
- 📈 **Charts**
  - Spending/income trends (bar, pie)
- 🧠 **Insights**
  - Rule-based auto-suggestions
- 📅 **Smart forms**
  - Currency-aware, date-friendly
- 🌈 **Dark/light mode**

---

## 📊 UI Components

- `DashboardCard` — animated stats with currency + progress
- `InsightCard` — dynamic rule-based suggestions
- `Quick Actions` — one-click add income/expense/budget/goal
- `SpendingTrendChart` — interactive daily/monthly/yearly charts
- `Grouped lists` — expenses/incomes by category or date

---

## 🛣 Roadmap

### What Budgenix offers today:
- Recurring item automation
- Category budgets and tracking
- Savings goals and planners
- Smart insights + dynamic dashboard
- User-specific currency and live formatting
- Visual trends + secure auth

### Coming soon:
- Vacation & wishlist financial planners
- Tier access with Pro features
- Household sharing + roles
- Stripe billing integration
- CSV import/export
- PWA + native app support

---

## 💡 Philosophy

> **Budgenix helps you do more than track your money — it helps you plan, act, and grow.**  
> Whether it's coffee or a wedding fund, Budgenix makes managing your finances visual, smart, and powerful.
