import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Type for user object returned by /me
type User = {
  id: string;
  userName: string;
  email: string;
  subscriptionTier: string;
  subscriptionIsActive: boolean;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  billingCycle: string;
  referralCode: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  theme: string;
  setTheme: (theme: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setThemeState] = useState<string>(() => {
    return localStorage.getItem("theme") ?? "halloween"; // default theme
  });

  // Check auth on app load
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/account/me", { credentials: "include" });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
        setIsLoggedIn(false);
      }finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // update <html data-theme> attribute
  const applyTheme = (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    // After login, fetch user info
    const meResponse = await fetch("/api/account/me", {
      credentials: "include",
    });
    if (meResponse.ok) {
      const userData = await meResponse.json();
      setUser(userData);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    await fetch("/api/account/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout, theme, setTheme: applyTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
