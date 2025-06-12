import { useAuth } from "../../context/AuthContext";

const lightThemes = [
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "garden",  
  "pastel",
  "fantasy",
  "lemonade",
  "winter",
  "nord",
  "silk"
];

const darkThemes = [
  "dark",
  "synthwave",
  "halloween",
  "forest",
  "luxury",
  "dracula",
  "night",
  "black",
  "dim",
  "sunset",
  "business",
  "coffee",
];

const customThemes = ["budgenixLightGreen", "budgenixLightOrange"];

const funThemes = [
  "retro",
  "cyberpunk",
  "valentine",
  "wireframe",
  "cmyk",
  "autumn",
  "acid",
  "aqua",
];

export function ThemeDropdown() {
  const { theme, setTheme } = useAuth();

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="text-sm/6 font-semibold text-base-content hover:text-primary cursor-pointer flex items-center gap-1 mr-4"
      >
        Theme: {theme}
        <svg
          className="inline-block w-4 h-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M7 7l3 3 3-3H7z" />
        </svg>
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-4 shadow bg-base-200 rounded-box w-auto max-h-96 overflow-auto flex gap-8"
      >
        {/* Light themes column */}
        <div>
          <h3 className="font-bold text-sm text-base-content mb-2">
            Light Themes
          </h3>
          {lightThemes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-2 mb-1 ${
                theme === t ? "font-bold" : ""
              }`}
            >
              <span
                data-theme={t}
                className="w-4 h-4 rounded-full bg-primary border border-base-content"
              ></span>
              {t}
            </button>
          ))}
        </div>

        {/* Dark themes column */}
        <div>
          <h3 className="font-bold text-sm text-base-content mb-2">
            Dark Themes
          </h3>
          {darkThemes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-2 mb-1 ${
                theme === t ? "font-bold" : ""
              }`}
            >
              <span
                data-theme={t}
                className="w-4 h-4 rounded-full bg-primary border border-base-content"
              ></span>
              {t}
            </button>
          ))}
        </div>

        {/*Custom Themes*/}
        <div>
        <h3 className="font-bold text-sm text-base-content mb-2">
          Custom
        </h3>
        {customThemes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`flex items-center gap-2 mb-1 ${
              theme === t ? "font-bold" : ""
            }`}
          >
            <span
              data-theme={t}
              className="w-4 h-4 rounded-full bg-primary border border-base-content"
            ></span>
            {t}
          </button>
        ))}
      </div>


        {/* Fun themes column */}
        <div>
          <h3 className="font-bold text-sm text-base-content mb-2">
            Fun Themes
          </h3>
          {funThemes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-2 mb-1 ${
                theme === t ? "font-bold" : ""
              }`}
            >
              <span
                data-theme={t}
                className="w-4 h-4 rounded-full bg-primary border border-base-content"
              ></span>
              {t}
            </button>
          ))}
        </div>
      </ul>
    </div>
  );
}
