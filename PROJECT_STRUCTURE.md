# Budgenix.API - Project Structure Philosophy

This document outlines the organizational principles used to structure the Budgenix.API solution.

---

## 📦 Domain-First Organization

We prioritize organizing files and folders by **domain** (e.g., Budgeting, Transactions, Categories) over technical concerns. This approach:

- Encourages cohesion within each domain
- Scales naturally with application growth
- Makes it easy for developers to locate relevant logic

---

## 📁 Folders

### Controllers
- API endpoint logic grouped by resource.

### Data
- Database context and seeding logic.

### Dtos
- Structured per domain (e.g., Budgeting, Incomes).
- Files are suffixed with `Dto` for clarity.

### Helpers
- Query utilities or domain-specific helper logic.

### Models
- Domain models grouped by context:
  - `Budgeting`: Budgets, types, attributes
  - `Transactions`: Expenses, incomes
  - `Categories`: Categories and defaults
  - `Shared`: Types used across multiple domains (e.g., recurrence enums)

### Services
- Application-level services, legacy data access, or abstraction layers.

---

## 📛 Naming Conventions

- **Entities**: Plain (e.g., `Expense`, `Income`, `Budget`)
- **DTOs**: Suffixed with `Dto` (e.g., `CreateIncomeDto`)
- **Enums**: Suffixed with `Enum` (e.g., `BudgetTypeEnum`)
- **Attributes**: Suffixed with `Attribute` (e.g., `UniqueBudgetAttribute`)

---

## ✅ Benefits

- Clean, readable, and intuitive layout
- Easier onboarding for new devs
- Supports layered architecture and separation of concerns
