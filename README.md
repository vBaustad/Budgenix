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

```
Budgenix/
├── frontend/             # React + Vite app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   └── Budgenix.API/     # ASP.NET Core Web API project
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       └── Program.cs
│
├── .gitignore
├── README.md
└── Budgenix.sln (optional)
```

---

## 🛠️ Getting Started

### Backend

1. Navigate to the backend project:
   ```
   cd backend/Budgenix.API
   ```
2. Run the API:
   ```
   dotnet run
   ```

### Frontend

1. Navigate to the frontend folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```

Frontend runs on `http://localhost:5173` by default.

---

## 📦 Features (Planned & In Progress)

- [x] Add/edit/delete expenses & income
- [x] Grouping by categories
- [ ] Recurring expenses
- [ ] Budget tracking per category
- [ ] Monthly summaries
- [ ] Excel import/export
- [ ] Savings goals & wishlists
- [ ] Upcoming expense reminders

---

## 🧠 Future Roadmap

- EF Core + SQL database migration
- User authentication (optional)
- Responsive/mobile-friendly UI
- GitHub Actions for CI/CD
- Deployment to Render / Azure / Vercel

---

## 📄 License

MIT – free for personal and commercial use.
