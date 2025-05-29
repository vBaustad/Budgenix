// src/context/UserContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  currency: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchUser = async () => {
    console.log("[UserContext] fetchUser() called");

    try {
      const res = await fetch("/api/account/me", {
        credentials: "include",
      });

      console.log("[UserContext] /me response status:", res.status);

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const userData: User = await res.json();
      console.log("[UserContext] /me returned user:", userData);

      if (userData?.id) {
        setUser(userData);
        console.log("[UserContext] user set:", userData.email);
      } else {
        console.warn("[UserContext] No valid user ID in response");
      }
    } catch (err) {
      console.error("[UserContext] failed to load user:", err);
      // do not reset user to null here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      console.log("[UserContext] useEffect running initial fetch");
      hasFetched.current = true;
      fetchUser();
    }
  }, []);

  const refetchUser = async () => {
    console.log("[UserContext] refetchUser() called");
    try {
      const res = await fetch("/api/account/me", {
        credentials: "include",
      });

      console.log("[UserContext] refetch /me response status:", res.status);

      if (!res.ok) {
        console.warn("[UserContext] refetch /me not ok, status:", res.status);
        return;
      }

      const userData: User = await res.json();
      console.log("[UserContext] refetch /me returned:", userData);

      if (userData?.id) {
        setUser(userData);
        console.log("[UserContext] user updated via refetch:", userData.email);
      }
    } catch (err) {
      console.error("[UserContext] refetch failed", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
