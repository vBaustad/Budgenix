# 💰 Budgenix 

**Budgenix** is a modern personal finance app that helps you track spending, manage income, plan budgets, and automate recurring items — with a focus on clarity, insight, and speed. From solo users to shared households, Budgenix is built to scale.

---

## 🚀 Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Frontend    | React + TypeScript + Vite   |
| Styling     | Tailwind CSS + DaisyUI      |
| Charts      | Recharts                    |
| Backend     | ASP.NET Core Web API (C#)   |
| ORM         | Entity Framework Core       |
| Database    | SQLite (local dev)          |
| Auth        | JWT + ASP.NET Identity      |
| Testing     | xUnit (.NET)                |

---

## 📦 Project Overview

Budgenix is designed to be modular, flexible, and user-friendly — from recurring item engines to category insights and chart visualizations.

### Core Features

- 🧩 Modular architecture (React + ASP.NET Core)
- 🔁 Recurring item support for income and expenses
- 📆 Grouping by month, year, or category
- 📊 Insights and visualizations for spending/income trends
- 🖥️ Responsive UI with light/dark mode
- 🌍 Currency selection (user-based) with inline formatting
- 🧠 Dynamic insights and rule-based suggestions

---

## 🔐 Auth & User System

- JWT login/signup with persistent session
- ASP.NET Identity for secure user management
- Tier-based access: Free / Pro / Pro+ (coming)
- Currency preference stored per user
- Household/multi-user support (planned)

---

## ✨ Backend API Endpoints

### ✅ ExpensesController

- `GET /api/expenses`
- `GET /api/expenses?groupBy=month|year|category`
- `GET /api/expenses/overview?month=&year=`
- `GET /api/expenses/total`
- `POST /api/expenses`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

### ✅ IncomesController

- `GET /api/incomes`
- `GET /api/incomes/overview?month=&year=`
- `GET /api/incomes/summary?months=6`
- `GET /api/incomes/total`
- `POST /api/incomes`
- `PUT /api/incomes/{id}`
- `DELETE /api/incomes/{id}`

### ✅ RecurringController

- `GET /api/recurring/upcoming`
- `POST /api/recurring`
- `PUT /api/recurring/{id}`
- `DELETE /api/recurring/{id}`
- `POST /api/recurring/{id}/trigger`
- `POST /api/recurring/{id}/skip`

### ✅ CategoriesController

- Default + user-defined category support

---

## 🧪 Testing

- `xUnit` for backend: DTO validation, logic, and query filtering
- React component testing (planned)

---

## 🧩 Frontend Highlights

### Context & Hooks

- `ExpensesContext`, `IncomesContext` – shared state via React Query
- `CurrencyContext` – user currency preference with live formatting
- `UserContext` – JWT user info and profile
- `RecurringContext` – recurring item management
- `DateFilterContext` – global month/year filtering

### Pages & Components

- ✅ Income Page
  - Add/edit income
  - Category selection
  - Optional recurring support
  - Grouped by month/year/category
  - Bar chart visualization
- ✅ Expense Page
  - Add/edit expense
  - Recurring item support
  - Grouped views
  - Pie chart visualization
- ✅ Shared Forms
  - Currency-aware inputs
  - Smart date handling
- ✅ Insight System
  - InsightCard components
  - Rules like "Spending spike", "Low income coverage", "Savings stall"
- ✅ Auth
  - Login / Signup / Logout with state persistence

---

## 📊 UI Highlights

- 📅 Dynamic groupings (monthly, yearly, by category)
- 📈 Recharts for bar/pie insights
- 🧠 Auto-generated insights and suggestions
- 🌓 DaisyUI dark/light mode
- 📱 Mobile responsive layout

---

## 🛣 Roadmap

### ✅ Recently Completed

- ✅ Complete recurring support in both income and expenses
- ✅ Grouped lists with dynamic labels and DataTable display
- ✅ CreateRecurringItem integration in form submit logic
- ✅ Filtering and sorting in grouped lists
- ✅ Shared currency context and formatting
- ✅ React Query-based caching + performance improvements

### 🔨 In Progress

- 🧮 Budget tracking page (set monthly limits per category)
- 📅 Vacation & wishlist financial planners
- 💳 Stripe billing and Pro tier access

### 💡 Future Ideas

- 🤝 Shared household & user roles
- 🧠 AI-powered suggestions (e.g., “cut X to meet goal”)
- 📤 Export/Import via CSV
- 📲 PWA and native app wrappers

---

## 🧠 Philosophy

> Budgenix is built for real financial control — not just for logging, but for planning, adapting, and growing your financial habits. Whether you're tracking your daily coffee or saving for a wedding, Budgenix is here to make it easy, visual, and insightful.
