import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import { getCurrentUser, getUserBookings, type User, type Booking } from "@/api/User";
import { newBooking, type NewBookingPayload } from "@/api/Booking";

type UserContextValue = {
    user: User | null;
    userLoading: boolean;
    bookings: Booking[] | null;
    bookingsLoading: boolean;
    addBooking: (payload: NewBookingPayload) => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ user, setUser ] = useState<User | null>(null);
    const [ userLoading, setUserLoading ] = useState<boolean>(false);
    const [ bookings, setBookings ] = useState<Booking[]>([]);
    const [ bookingsLoading, setBookingsLoading ] = useState<boolean>(false);

    useEffect(() => {
        void fetchUser();
        void fetchUserBookings();
    }, [loggedIn])

    async function fetchUser() {
        if(!loggedIn) {
            setUser(null);
            return;
        }

        setUserLoading(true);

        try {
            const response = await getCurrentUser();
            setUser(response.data);
        } catch {
            setUser(null);
        } finally {
            setUserLoading(false);
        }
    }

    async function fetchUserBookings() {
        if(!loggedIn) {
            setBookings([]);
            return;
        }

        setBookingsLoading(true);

        try {
            const response = await getUserBookings();
            setBookings(response.data.bookings ?? []);
        } catch {
            setBookings([]);
        } finally {
            setBookingsLoading(false);
        }
    }

    async function addBooking(payload: NewBookingPayload) {
        await newBooking(payload);
        await fetchUserBookings();
    }

    return (
        <UserContext.Provider value={{ user, userLoading, bookings, bookingsLoading, addBooking }}>
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
