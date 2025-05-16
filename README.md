💰 Budgenix
Budgenix is a full-featured personal finance app designed to give users control and clarity over their money. Track expenses, manage income, plan budgets, and automate recurring items — all through a fast and intuitive interface.

🚀 Tech Stack
Layer	Technology
Frontend	React + TypeScript + Vite
Styling	Tailwind CSS + DaisyUI
Charts	Recharts
Backend	ASP.NET Core Web API (C#)
ORM	Entity Framework Core
Database	SQLite (local dev)
Auth	JWT + ASP.NET Identity
Testing	xUnit (.NET)

📦 Project Overview
Budgenix is architected for scalability, from solo users to shared households. The architecture is modular with clear domain separation and reusable components.

Features:
🧩 Modular React + ASP.NET Core architecture

🔁 Recurring expense system (fully editable)

📆 Grouped expense/income views

📊 Category charts and summaries

💾 SQLite EF Core setup

🔐 JWT auth with login/signup/logout

🎨 Dark mode & mobile responsive

📚 Centralized query logic with filtering/sorting/grouping

📉 Currency symbol support in all money fields

🔐 Auth & User System
Secure login & signup with JWT

Role support (Free, Pro, Pro+) — in progress

ASP.NET Identity integration

Household/user ownership for all data

Auth-protected API routes

Frontend session persistence

✨ Backend API Features
✅ ExpensesController
GET /api/expenses – All expenses, with optional filters

GET /api/expenses?groupBy=month|year|category

GET /api/expenses/total – Total summary

POST /api/expenses – Create expense (also supports recurring)

PUT /api/expenses/{id} – Edit

DELETE /api/expenses/{id} – Remove

✅ RecurringController
GET /api/recurring/upcoming – Upcoming recurring expenses

PUT /api/recurring/{id} – Edit recurring item

DELETE /api/recurring/{id} – Delete recurring item

POST /api/recurring/{id}/trigger – Mark as paid (generate expense)

POST /api/recurring/{id}/skip – Skip next occurrence

✅ IncomesController
CRUD support

Filtering and grouping (same as expenses)

✅ BudgetsController
Create/track monthly budgets

Live progress monitoring

Category + month scope

✅ CategoriesController
Supports both default and user-created categories

🧪 Testing
xUnit for service/helper logic

Tests for grouping, filtering, DTO mapping, and auth

🧩 Frontend Features
Pages
💸 Expenses Page (core view)

💡 Recurring Editor: Edit, Skip, Mark as Paid

🛠️ Auth UI (login, signup, logout)

📊 BreakdownPieChart (category overview)

Forms & Components
AddExpenseForm – supports recurring

EditRecurringItemForm – full editable

GroupedExpensesList – expandable groups

DataTable – reused for flat lists

SelectField / InputField – consistent styling, currency-aware

UI Enhancements
📅 Upcoming Recurring Sidebar with insights

💡 Recurring Summary & Insights

🧮 Currency input with inline "kr" / "$" styling

🎨 DaisyUI dark mode

📱 Mobile responsive layout

🧭 Sidebar + Topbar for nav

📊 UI Highlights
⬇️ InputField with currency indicators

📈 Recharts-powered PieCharts

📆 Grouped expenses by date or category

🧾 Actionable recurring insights (e.g., “3 due this week”)

🧮 Auto-calculate total recurring for month

🛣️ Roadmap
✅ Near-Term
 Recurring system + actions (Edit, Skip, Trigger)

 Currency display globally

 SQLite migrations + EF Core

 Auth-protected routes

 Modular services and DTOs

 Pie chart + grouped expenses list

🔜 Mid-Term
Budget progress tracking (by category/month)

Shared household mode

Wishlists and savings goals

Notification system for upcoming items

🚀 Long-Term
Stripe integration for Pro plans

CSV/Excel import/export

Recurring income (matching expenses)

AI-powered budget suggestions (experimental)

🧠 Project Philosophy
Budgenix is built not just to track money — but to give you control over it. From its scalable backend to polished frontend UI, every feature is thoughtfully engineered for clarity, usability, and long-term maintainability.

📌 Updated regularly as development progresses
