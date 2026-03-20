import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import * as SecureStore from 'expo-secure-store';
import {loginRequest, registerRequest, type LoginPayload, type RegisterPayload} from '@/api/Auth';
import {setAuthTokenProvider} from '@/api/core/client';

const TOKEN_KEY = 'auth_token';

interface AuthContextValue {
    token: string | null;
    loggedIn: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setLoggedIn(!!token);
        setAuthTokenProvider(() => token);
    }, [token]);

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
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
        setToken(response.data.token);
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const response = await registerRequest(payload);
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
        setToken(response.data.token);
    }, []);

    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, loggedIn, isLoading, login, register, logout }}>
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
