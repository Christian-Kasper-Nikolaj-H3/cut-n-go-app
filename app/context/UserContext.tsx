import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import { getCurrentUser, type User } from "@/api/User";

type UserContextValue = {
    user: User | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ user, setUser ] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            if(!loggedIn) {
                setUser(null);
                return;
            }

            const response = await getCurrentUser();
            setUser(response.data);
        }

        void fetchUser();
    }, [loggedIn])

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
