
import { createContext, useContext, useState, ReactNode } from 'react';


const AuthContext = createContext<{ isLoggedIn: boolean; login: () => void; logout: () => void } | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    //const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(true);  // 👈 force to `true`


    const logIn = () => setIsLoggedIn(true);
    const logOut = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login: logIn, logout: logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}