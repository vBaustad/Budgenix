import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  theme: string;
  setTheme: (theme: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") ?? "halloween";
  });

  const applyTheme = (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error(await res.text());
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await fetch("/api/account/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        theme,
        setTheme: applyTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
