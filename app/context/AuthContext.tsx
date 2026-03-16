import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, removeToken } from '@/services/auth';
import { router } from 'expo-router';

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadToken() {
            const stored = await getToken();
            setToken(stored);
            setIsLoading(false);
        }
        loadToken();
    }, []);

    const login = async (newToken: string) => {
        await saveToken(newToken);
        setToken(newToken);
        router.replace('/(tabs)');
    };

    const logout = async () => {
        await removeToken();
        setToken(null);
        router.replace('/(auth)/login');
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth skal bruges inden i AuthProvider');
    return ctx;
}