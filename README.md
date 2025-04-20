# 💰 Budgenix

**Budgenix** is a full-stack personal budgeting app designed to help users track expenses, manage income, and stay financially in control.

> A scalable web application using ASP.NET Core + React + TypeScript.

---

## 🚀 Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | React + TypeScript + Vite       |
| Backend    | ASP.NET Core Web API (C#)       |
| Storage    | Temporary: JSON-based files     |
| Future     | EF Core + SQL database          |

---

## 📁 Project Structure

📦 [View the full project structure philosophy](./PROJECT_STRUCTURE.md)

---

## 🌐 API Endpoints – ExpensesController

| Method | Route                                 | Description                                  |
|--------|----------------------------------------|----------------------------------------------|
| GET    | `/api/expenses`                        | Get all expenses (optionally filtered)       |
| GET    | `/api/expenses?from&to&category&sort&skip&take` | Filter, sort, and paginate         |
| GET    | `/api/expenses/total`                 | Get total amount of expenses                 |
| GET    | `/api/expenses/recurring-upcoming`    | Get upcoming recurring expenses              |
| GET    | `/api/expenses/categories`            | Get unique category names                    |
| GET    | `/api/expenses/search?query=rent`     | Search by name or description                |
| GET    | `/api/expenses/{id}`                  | Get a single expense by ID                   |
| POST   | `/api/expenses`                       | Create a new expense                         |
| PUT    | `/api/expenses/{id}`                  | Update an existing expense                   |
| DELETE | `/api/expenses/{id}`                  | Delete an expense                            |

---

## ✅ Implemented Features

- [x] Expense CRUD operations
- [x] Recurring expense support
- [x] Sorting (date, amount, name)
- [x] Filtering (date, category)
- [x] Pagination (skip & take)
- [x] Unique ID with `Guid.NewGuid()`
- [x] JSON-based storage for portability

---

## 🔜 Next Steps

- [ ] Build `IncomesController` with same structure
- [ ] Start React frontend for expenses
- [ ] Add monthly and category-based summaries
- [ ] Add basic auth layer (optional)
- [ ] Move storage to SQLite or EF Core
- [ ] UI components for sorting, pagination, search

---

This file will be updated as we progress. 🚀---
