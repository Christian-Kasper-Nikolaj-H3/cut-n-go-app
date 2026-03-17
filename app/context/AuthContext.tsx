import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {PropsWithChildren} from 'react';
import * as SecureStore from 'expo-secure-store';
import {getCurrentUserRequest, loginRequest, registerRequest, type AuthUser, type LoginPayload, type RegisterPayload} from '@/api/auth';

const TOKEN_KEY = 'auth_token';

interface AuthContextValue {
    token: string | null;
    user: AuthUser | null;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCurrentUser = useCallback(async (authToken: string) => {
        const currentUser = await getCurrentUserRequest(authToken);
        setUser(currentUser);
    }, []);

    useEffect(() => {
        async function restoreToken() {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                setToken(storedToken);

                if (storedToken) {
                    await loadCurrentUser(storedToken);
                } else {
                    setUser(null);
                }
            } catch {
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        void restoreToken();
    }, [loadCurrentUser]);

    const login = useCallback(async (payload: LoginPayload) => {
        const response = await loginRequest(payload);
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
        await loadCurrentUser(response.token);
    }, [loadCurrentUser]);

    const register = useCallback(async (payload: RegisterPayload) => {
        const response = await registerRequest(payload);
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
        await loadCurrentUser(response.token);
    }, [loadCurrentUser]);

    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        token,
        user,
        isLoading,
        login,
        register,
        logout,
    }), [token, user, isLoading, login, register, logout]);

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