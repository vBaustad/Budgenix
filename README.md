# 💰 Budgenix

**Budgenix** is a full-featured personal finance app designed to give users control and clarity over their money. Track expenses, manage income, plan budgets, and automate recurring items — all through a fast and intuitive interface.

---

## 🚀 Tech Stack

| Layer       | Technology                  |
|-------------|------------------------------|
| Frontend    | React + TypeScript + Vite    |
| Styling     | Tailwind CSS + DaisyUI       |
| Charts      | Recharts                     |
| Backend     | ASP.NET Core Web API (C#)    |
| ORM         | Entity Framework Core        |
| Database    | SQLite (local dev)           |
| Auth        | JWT + ASP.NET Identity       |
| Testing     | xUnit (.NET)                 |

---

## 📦 Project Overview

Budgenix is architected for scalability — from solo budgeting to shared households. The system is modular, well-structured, and designed for maintainability.

### Highlights

- 🧩 Modular React + ASP.NET Core structure
- 🔁 Fully editable recurring expense engine
- 📆 Grouped views (by month, year, category)
- 📊 Pie chart with category summaries
- 🖥️ Mobile-ready with dark mode support
- 💾 SQLite + EF Core setup
- 🔐 JWT authentication with persistent session
- 💸 Currency symbol support in inputs

---

## 🔐 Auth & User System

- Secure login & signup with JWT
- Role support: Free / Pro / Pro+ (coming soon)
- Household ownership for all records
- Auth-protected routes and data filters
- ASP.NET Identity for user management

---

## ✨ Backend API Endpoints

### ✅ ExpensesController
- GET /api/expenses
- GET /api/expenses?groupBy=month|year|category
- GET /api/expenses/total
- POST /api/expenses
- PUT /api/expenses/{id}
- DELETE /api/expenses/{id}


### ✅ RecurringController
- GET /api/recurring/upcoming
- PUT /api/recurring/{id}
- DELETE /api/recurring/{id}
- POST /api/recurring/{id}/trigger ← mark as paid
- POST /api/recurring/{id}/skip ← skip this occurrence


### ✅ IncomesController

- Full CRUD
- Grouping and filtering (same as Expenses)

### ✅ BudgetsController

- Define monthly/category goals
- Track progress toward limits

### ✅ CategoriesController

- Manage default and user-defined categories

---

## 🧪 Testing

- xUnit project for backend
- DTO mapping tests
- Filtering + grouping logic coverage

---

## 🧩 Frontend Features

### Pages & Components

- ✅ Expenses page
- ✅ AddExpenseForm (supports recurring)
- ✅ EditRecurringItemForm
- ✅ GroupedExpensesList
- ✅ Pie chart for category breakdown
- ✅ Recurring Summary & Insights
- ✅ Currency-aware InputField
- ✅ Login / Signup / Logout
- ✅ Reusable SelectField and layouts

### UI Enhancements

- 📅 Date-based grouping
- 📈 Pie chart + legend
- 💡 Insight panel (e.g., “3 due this week”)
- 💰 Currency shown inline in inputs
- 🌙 DaisyUI dark mode support
- 📱 Mobile-responsive layout

---

## 📊 UI Highlights

- Recharts PieChart with tooltips
- Editable recurring list with action buttons
- Buttons: "✓ Mark Paid", "⏭ Skip", "🛠 Edit"
- Sidebar + Topbar layout system
- Light/dark mode via DaisyUI
- Beautiful currency fields across app

---

## 🛣 Roadmap

### ✅ Completed

- Recurring system: edit, skip, trigger
- SQLite + EF Core migrations
- Login, signup, auth-protected pages
- Grouping, filtering, sorting of expenses
- Pie chart and category summaries
- Currency input formatting

### 🔜 In Progress

- Monthly and category budgets
- Shared household support
- Wishlist and savings goals
- Income matching + recurring income

### 🚀 Future Ideas

- Stripe + Pro subscription billing
- CSV / Excel import/export
- Budget planning AI assistant (experimental)

---

## 🧠 Philosophy

> Budgenix isn't just another expense tracker — it's a financial control system designed to grow with your goals. Modular, scalable, clean — from database to pixel.

---

_This README is updated automatically as development progresses._

