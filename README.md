💰 Budgenix
Budgenix is a modern personal finance app that helps you track spending, manage income, plan budgets, and automate recurring items — with a focus on clarity, insight, and speed. From solo users to shared households, Budgenix is built to scale.

🚀 Tech Stack
Layer	Technology
Frontend	React + TypeScript + Vite
Styling	Tailwind CSS + DaisyUI
Charts	Recharts
Backend	ASP.NET Core Web API (C#)
ORM	Entity Framework Core
Database	SQLite (local dev)
Auth	JWT + ASP.NET Identity
Testing	xUnit (.NET), React Testing (planned)

📦 Project Overview
Budgenix is designed to be modular, flexible, and user-friendly — from recurring item engines to category insights and chart visualizations.

Core Features
🧩 Modular architecture (React + ASP.NET Core)

🔁 Powerful recurring engine for both income and expenses

📆 Grouping by month, year, or category

📊 Income & expense insights and trend visualizations

🖥️ Mobile-ready, dark mode enabled

🌍 Currency selection with persistence and inline formatting

🔐 Auth & User System
JWT login/signup with persistent session

ASP.NET Identity for secure user management

Tier-based access: Free / Pro / Pro+ (coming)

Currency preference stored per user

Household/multi-user support (planned)

✨ Backend API Endpoints
✅ ExpensesController
GET /api/expenses — filtering, grouping, sorting

GET /api/expenses/overview?month=&year=

GET /api/expenses/total

POST /api/expenses

PUT /api/expenses/{id}

DELETE /api/expenses/{id}

✅ IncomesController
GET /api/incomes — with filters & groupBy

GET /api/incomes/overview?month=&year=

GET /api/incomes/total

POST /api/incomes

PUT /api/incomes/{id}

DELETE /api/incomes/{id}

GET /api/incomes/summary?months=6 — grouped chart data

✅ RecurringController
GET /api/recurring/upcoming

PUT /api/recurring/{id}

DELETE /api/recurring/{id}

POST /api/recurring/{id}/trigger ← mark as paid

POST /api/recurring/{id}/skip ← skip this occurrence

✅ CategoriesController
Default + user-defined category management

🧪 Testing
xUnit for backend: DTO mapping, filters, logic

React component testing planned

🧩 Frontend Highlights
🔧 Context & Hooks
ExpensesContext, IncomesContext — centralized state & React Query

CurrencyContext — currency preference, updates, and formatting

UserContext — JWT-based user data

DateFilterContext — month/year selectors for filters and overview

🧾 Expense + Income Pages
Full CRUD for expenses & incomes

Grouped list rendering (month, year, category)

Insight panels per section (e.g., income vs recurring coverage)

Charts with tooltips, categories, and summary comparisons

Bar chart for monthly income trends

Pie chart for expense breakdown

Inline formatted currency fields

💡 Insight System
Modular rules engine for insights:

LowIncomeCoverageRule

SpendingUpRule, NoBudgetSetRule, etc.

Custom icon, message, status, and category per insight

Insight panel dynamically updates with month

📊 UI Overview
🔲 Responsive grid layout

🎨 Dark/light theme support via DaisyUI

📈 Recharts for pie + bar visualizations

✅ Form components with validation

📆 Auto-calculated recurring next dates

🧠 Insight cards with icons and color-coded statuses

🛣 Roadmap
✅ Recently Completed
✅ Income system with overview and recurring support

✅ Bar chart for income category breakdown by month

✅ Insight rules for income (e.g., insufficient to cover recurring)

✅ Backend currency formatting per user

✅ React Query migration for shared data handling

✅ Grouping, filtering, pagination for income

🔨 In Progress
💡 Budget tracking & goal progress

📅 Vacation + wishlist planning

💳 Stripe + subscription billing

📤 CSV import/export

💡 Future Ideas
🤝 Shared household data sync

💬 AI budget planner

📲 PWA / mobile app support

🔍 Transaction search + tagging

🧠 Philosophy
Budgenix is built for real financial control. Not just logging — but planning, predicting, and adjusting. The system grows with your needs — clean, extensible, and empowering.

