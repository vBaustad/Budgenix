import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "../utils/api"; // adjust the path as needed

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
    await apiFetch("/api/account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setIsLoggedIn(true);
  };

  const logout = async () => {
    await apiFetch("/api/account/logout", {
      method: "POST",
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
