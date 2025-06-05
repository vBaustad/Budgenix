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
- 🔁 Powerful recurring engine for both income and expenses
- 📆 Grouping by month, year, or category
- 📊 Income & expense insights and trend visualizations
- 🖥️ Mobile-ready, dark mode enabled
- 🌍 Currency selection with persistence and inline formatting

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
- `PUT /api/recurring/{id}`
- `DELETE /api/recurring/{id}`
- `POST /api/recurring/{id}/trigger`
- `POST /api/recurring/{id}/skip`

### ✅ CategoriesController

- Default + user-defined category management

---

## 🧪 Testing

- `xUnit` for backend: DTO mapping, filters, logic
- React component testing planned

---

## 🧩 Frontend Highlights

### Context & Hooks

- `ExpensesContext`, `IncomesContext` — centralized state using React Query
- `CurrencyContext` — currency preference, updates, and formatting
- `UserContext` — JWT-based user data
- `DateFilterContext` — month/year selectors for filters and overview

### Pages & Components

- ✅ Expense and Income pages
- ✅ Add/Edit forms with recurring support
- ✅ Grouped list rendering (month, year, category)
- ✅ Pie chart for expenses, bar chart for incomes
- ✅ Insight panel with rules and auto-generated suggestions
- ✅ Auth forms: Login / Signup / Logout
- ✅ Currency-aware inputs and formatting

---

## 📊 UI Highlights

- 📅 Monthly/Yearly/Category groupings
- 📈 Recharts-based visualizations (bar/pie)
- 💬 InsightCard with dynamic rule-based content
- 🌓 Dark/light theme via DaisyUI
- 📱 Mobile responsive layout

---

## 🛣 Roadmap

### ✅ Recently Completed

- ✅ Income system with overview and recurring support
- ✅ Bar chart for income category breakdown by month
- ✅ Insight rules for income (e.g., insufficient to cover recurring)
- ✅ Backend currency formatting per user
- ✅ React Query migration for shared data handling
- ✅ Grouping, filtering, pagination for income

### 🔨 In Progress

- 💡 Budget tracking & goal progress
- 📅 Vacation & wishlist planners
- 💳 Stripe subscription billing

### 💡 Future Ideas

- 🤝 Shared household data
- 🧠 AI-powered budget assistant
- 📲 PWA/mobile app support
- 📤 CSV import/export

---

## 🧠 Philosophy

> Budgenix is built for real financial control. Not just logging — but planning, predicting, and adjusting. The system grows with your needs — clean, extensible, and empowering.
