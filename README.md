# 📘 Budgenix Project Documentation

A full-stack personal budgeting web app, migrated from WPF to a modern web stack using ASP.NET Core + React.

---

## 📦 Technologies Used

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React (with TypeScript planned) |
| Backend   | ASP.NET Core Web API (C#) |
| Storage   | JSON file persistence (AppData & DataStore) |
| Future    | EF Core / SQL for data storage |

---

## 🧱 Project Structure

### Backend

- `Models/`
  - `Expense.cs`
  - `Income.cs`
  - `Category.cs`
  - `AppData.cs`

- `Data/`
  - `DataStore.cs` – handles loading/saving app data
  - `DefaultCategories.cs` – provides default category list

- `Controllers/`
  - `ExpensesController.cs` – handles all expense-related endpoints

---

## 📌 Expense Model

```csharp
public class Expense
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public Category Category { get; set; }
    public bool IsRecurring { get; set; }
    public string RecurrenceFrequency { get; set; }
    public string Notes { get; set; }
}
```

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

## 🧠 Dev Terms You're Using Now

| Concept            | Example                             |
|--------------------|-------------------------------------|
| REST API           | `/api/expenses`, verbs, status codes|
| LINQ               | `.Where()`, `.Sum()`, `.OrderBy()`  |
| DTO (optional)     | For unified reporting later         |
| Pagination         | `skip`, `take` query params         |
| POCO Models        | `Expense`, `Income`, `Category`     |
| Guid IDs           | `Guid.NewGuid()` instead of int     |

---

This file will be updated as we progress. 🚀---

## 🧾 Source Code

### 📄 Expense.cs
```csharp
public class Expense
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public Category Category { get; set; }
    public bool IsRecurring { get; set; }
    public string RecurrenceFrequency { get; set; }
    public string Notes { get; set; }
}
```

---

### 📄 Category.cs
```csharp
public class Category
{
    public string Name { get; set; }
    public CategoryType Type { get; set; } // Expense, Income, or Both
    public bool IsUserDefined { get; set; }
}
```

---

### 📄 AppData.cs
```csharp
public class AppData
{
    public List<Expense> Expenses { get; set; } = new();
    public List<Category> Categories { get; set; } = new();
}
```

---

### 📄 DataStore.cs
```csharp
public static class DataStore
{
    private static string FilePath => "appdata.json";

    public static AppData Load()
    {
        if (!File.Exists(FilePath))
            return new AppData();

        var json = File.ReadAllText(FilePath);
        return JsonSerializer.Deserialize<AppData>(json) ?? new AppData();
    }

    public static void Save(AppData data)
    {
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(FilePath, json);
    }
}
```

---

### 📄 ExpensesController.cs
```csharp
[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private AppData _appData = DataStore.Load();

    [HttpGet]
    public ActionResult<IEnumerable<Expense>> GetExpenses(
        DateTime? from = null,
        DateTime? to = null,
        string? category = null,
        string? sort = null,
        int skip = 0,
        int take = 100)
    {
        var result = _appData.Expenses.AsEnumerable();

        if (from.HasValue)
            result = result.Where(e => e.Date >= from.Value);
        if (to.HasValue)
            result = result.Where(e => e.Date <= to.Value);
        if (!string.IsNullOrWhiteSpace(category))
            result = result.Where(e => e.Category?.Name?.Equals(category, StringComparison.OrdinalIgnoreCase) == true);

        if (!string.IsNullOrWhiteSpace(sort))
        {
            result = sort.ToLower() switch
            {
                "date_asc" => result.OrderBy(e => e.Date),
                "date_desc" => result.OrderByDescending(e => e.Date),
                "amount_asc" => result.OrderBy(e => e.Amount),
                "amount_desc" => result.OrderByDescending(e => e.Amount),
                "name_asc" => result.OrderBy(e => e.Name),
                "name_desc" => result.OrderByDescending(e => e.Name),
                _ => result
            };
        }

        return Ok(result.Skip(skip).Take(take));
    }

    [HttpGet("total")]
    public ActionResult<decimal> GetTotalAmount()
        => Ok(_appData.Expenses.Sum(e => e.Amount));

    [HttpGet("recurring-upcoming")]
    public ActionResult<IEnumerable<Expense>> GetUpcomingRecurringExpenses(int daysAhead = 30)
        => Ok(_appData.Expenses
            .Where(e => e.IsRecurring && e.Date >= DateTime.Today && e.Date <= DateTime.Today.AddDays(daysAhead))
            .ToList());

    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetUsedExpenseCategories()
        => Ok(_appData.Expenses
            .Where(e => e.Category != null)
            .Select(e => e.Category.Name)
            .Distinct()
            .OrderBy(n => n)
            .ToList());

    [HttpGet("{id}")]
    public ActionResult<Expense> GetExpenseById(Guid id)
    {
        var expense = _appData.Expenses.FirstOrDefault(e => e.Id == id);
        return expense == null ? NotFound() : Ok(expense);
    }

    [HttpPost]
    public ActionResult AddExpense(Expense expense)
    {
        expense.Id = Guid.NewGuid();
        _appData.Expenses.Add(expense);
        DataStore.Save(_appData);
        return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, expense);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateExpense(Guid id, Expense updated)
    {
        var existing = _appData.Expenses.FirstOrDefault(e => e.Id == id);
        if (existing == null) return NotFound();

        existing.Name = updated.Name;
        existing.Description = updated.Description;
        existing.Amount = updated.Amount;
        existing.Category = updated.Category;
        existing.Date = updated.Date;
        existing.IsRecurring = updated.IsRecurring;
        existing.RecurrenceFrequency = updated.RecurrenceFrequency;
        existing.Notes = updated.Notes;

        DataStore.Save(_appData);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteExpense(Guid id)
    {
        var expense = _appData.Expenses.FirstOrDefault(e => e.Id == id);
        if (expense == null) return NotFound();

        _appData.Expenses.Remove(expense);
        DataStore.Save(_appData);
        return NoContent();
    }
}
```
