import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "../utils/api";
import { queryClient } from "@/lib/queryClient";

type AuthContextType = {
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


  const navigate = useNavigate();

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") ?? "budgenixLightGreen";
  });

  const applyTheme = (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);

    const checkSession = async () => {
      try {
        await apiFetch('/api/account/me');
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkSession();
  }, []);



  const login = async (email: string, password: string) => {
    await apiFetch("/api/account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setIsLoggedIn(true);
  };

  const logout = async () => {
    await apiFetch("/api/account/logout", { method: "POST" });
    setIsLoggedIn(false);
    await queryClient.clear();

  };


  return (
    <AuthContext.Provider
      value={{
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
