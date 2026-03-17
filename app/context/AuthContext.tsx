import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {PropsWithChildren} from 'react';
import * as SecureStore from 'expo-secure-store';
import {loginRequest, registerRequest, type LoginPayload, type RegisterPayload} from '@/api/auth';

const TOKEN_KEY = 'auth_token';

interface AuthContextValue {
    token: string | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreToken() {
            const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
            setToken(storedToken);
            setIsLoading(false);
        }

        void restoreToken();
    }, []);

    const login = useCallback(async (payload: LoginPayload) => {
        const response = await loginRequest(payload);
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const response = await registerRequest(payload);
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
    }, []);

    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
    }, []);

    const value = useMemo(() => ({
        token,
        isLoading,
        login,
        register,
        logout,
    }), [token, isLoading, login, register, logout]);

    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
