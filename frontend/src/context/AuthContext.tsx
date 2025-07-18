import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "../utils/api";
import { queryClient } from "@/lib/queryClient";

type User = {
  id: string;
  email: string;
  isAdmin: boolean;
  // add more fields if needed
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  theme: string;
  setTheme: (theme: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem("theme") ?? "budgenixLightGreen";
    document.documentElement.setAttribute("data-theme", stored);
    return stored;
  });

  const applyTheme = (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  // Check current session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const me = await apiFetch<User>('/api/user/me');
        setUser(me);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkSession();
  }, []);

  // Login
  const login = async (login: string, password: string) => {
    await apiFetch("/api/account/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });

    const me = await apiFetch<User>('/api/user/me');
    setUser(me);
    setIsLoggedIn(true);
  };

  // Logout
  const logout = async () => {
    await apiFetch("/api/account/logout", { method: "POST" });
    setUser(null);
    setIsLoggedIn(false);
    await queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        authChecked,
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
