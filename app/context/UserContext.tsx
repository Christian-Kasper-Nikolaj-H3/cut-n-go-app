import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import { getCurrentUser } from "@/api/User";

const UserContext = createContext(null);

export function UserProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            if(!loggedIn) {
                setUser(null);
                return;
            }

            const data = await getCurrentUser();
            setUser(data);
        }

        void fetchUser();
    }, [loggedIn])

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);