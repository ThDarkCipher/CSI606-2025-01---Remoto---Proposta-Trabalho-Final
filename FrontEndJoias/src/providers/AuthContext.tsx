import type { AuthContextType, User } from "@/types/auth";
import { createContext, useContext, useState, type ReactNode } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Usar stata para guardar essas informações apenas para teste e desenvolvimentos
    //Após isso, migrar para um Http-only para evitar XSS e CSRF
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
    }

    const logout = () => {
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context; 
}