# 💰 Budgenix

**Budgenix** is a full-featured personal finance app built with modern technologies to help users **track expenses**, **manage income**, **set budgets**, and **gain financial clarity** — all with a clean, responsive interface.

---

## 🚀 Tech Stack

| Layer      | Technology                        |
|------------|------------------------------------|
| Frontend   | React + TypeScript + Vite         |
| Styling    | Tailwind CSS + DaisyUI            |
| Charts     | Recharts                          |
| Backend    | ASP.NET Core Web API (C#)         |
| ORM        | Entity Framework Core             |
| Database   | SQLite (local dev)                |
| Auth       | JWT + ASP.NET Identity            |
| Testing    | xUnit (.NET)                      |

---

## 📦 Project Overview

Budgenix is built to scale from solo budget tracking to full multi-user support with shared households and subscription tiers. Key features include:

- Modular architecture (separated by domain: expenses, income, budgets, users)
- Reusable React components for forms, filters, and tables
- Dark mode and mobile responsiveness out of the box
- Centralized query helpers (server-side) for grouping and filtering

---

## 🔐 Auth & User System

- User registration and login with JWT auth
- Role-based access planned (Free, Pro, Pro+)
- Optional referral and discount code support
- Household structure for future sharing/collab
- Auth UI: Login, Signup, Logout integrated

---

## ✨ Backend Features

### ✅ ExpensesController
- `GET /api/expenses`: get all expenses
- `GET /api/expenses?groupBy=month|year|category`: group dynamically
- `GET /api/expenses/total`: get total amount
- `GET /api/expenses/recurring-upcoming`: get upcoming recurring items
- `GET /api/expenses/categories`: list used category names
- `POST /api/expenses`: create new
- `PUT /api/expenses/{id}` / `DELETE`: update or remove

### ✅ IncomesController
- CRUD and grouping support (mirrors ExpensesController)

### ✅ BudgetsController
- Define budgets with goal/limit
- Track progress
- Monthly/category support planned

### ✅ CategoriesController
- Handles both default and user-defined categories

### ✅ SubscriptionController
- Placeholder for subscription tier logic

---

## 🧩 Frontend Features

- Full **login/signup flow** with token persistence
- **Landing page** and main layout (navbar, sidebar, topbar)
- **Expenses Page**:
  - Add expense form
  - Filters: category, date
  - Grouping: by month, year, category
  - Sorting + pagination ready
  - Grouped expenses view with expandable sections
  - Pie chart by category with matching total list
- Componentized UI:
  - `DataTable`, `SelectField`, `GroupedExpensesList`, `AddExpenseForm`
  - Reusable layout & theme structure

---

## 📊 UI Highlights

- 📅 Grouped list views
- 📈 Interactive pie charts via Recharts
- 🎯 Live category summaries beside charts
- 🌙 Theme-aware with DaisyUI (dark mode ready)
- 📱 Fully responsive layout

---

## 🧪 Testing

- `xUnit` test project for backend service + helper coverage
- DTO and mapping validation
- Query logic tested for grouping/filters

---

## 🛣️ Roadmap

### Near-term
- [x] Incomes API and UI
- [x] Pie chart + grouped list
- [x] Landing, login, signup
- [x] SQLite migration + EF Core setup
- [ ] Monthly budgets and summaries
- [ ] Auth-protected routes

### Long-term
- [ ] Shared household budgets
- [ ] Income goal planner
- [ ] Wishlist and shopping list
- [ ] Excel/CSV import/export
- [ ] Stripe + Pro subscriptions

---

## 🧠 Project Philosophy

Budgenix isn’t just another expense tracker. It’s built for scale, clarity, and control — from clean React UI to organized backend controllers. Designed to grow with your financial goals.

---

_Updated automatically as development progresses 🚀_
