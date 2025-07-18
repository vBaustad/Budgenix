import { useAuth } from "../../context/AuthContext";
import { CheckCircle2 } from "lucide-react";

const lightThemes = [
  { id: "budgenixLight", label: "Light" },
  { id: "budgenixLightGreen", label: "Light Green" },
  { id: "budgenixLightOrange", label: "Light Orange" },
];
const darkThemes = [
  { id: "budgenixDark", label: "Dark" },
  { id: "budgenixDarkGreen", label: "Dark Green" },
  { id: "budgenixDarkOrange", label: "Dark Orange" },
];

export function ThemeDropdown() {
  const { theme, setTheme } = useAuth();
  const currentTheme = [...lightThemes, ...darkThemes].find((t) => t.id === theme);

  const renderTheme = (t: { id: string; label: string }) => (
    <button
      key={t.id}
      onClick={() => setTheme(t.id)}
      className={`flex items-center gap-2 p-2 w-full rounded hover:bg-base-300 relative ${
        theme === t.id ? "ring-1 ring-primary ring-offset-1" : ""
      }`}
    >
      <span className="text-sm">{t.label}</span>
      {theme === t.id && (
        <CheckCircle2 className="w-4 h-4 text-primary absolute right-2" />
      )}
    </button>
  );

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-sm btn-outline flex items-center gap-2 min-w-[10rem] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {currentTheme ? currentTheme.label : "Select Theme"}
          </span>
        </div>
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M7 7l3 3 3-3H7z" />
        </svg>
      </label>

      <div
        tabIndex={0}
        className="dropdown-content z-[1] p-4 shadow bg-base-200 rounded-box w-64 grid gap-4"
      >
        <div>
          <h3 className="font-bold text-xs mb-1 text-base-content">Light</h3>
          <div className="grid gap-1">{lightThemes.map(renderTheme)}</div>
        </div>
        <div>
          <h3 className="font-bold text-xs mb-1 text-base-content">Dark</h3>
          <div className="grid gap-1">{darkThemes.map(renderTheme)}</div>
        </div>
      </div>
    </div>
  );
}
