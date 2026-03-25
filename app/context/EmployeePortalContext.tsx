import {createContext, type PropsWithChildren, useContext, useEffect, useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {
    completeEmployeeBooking as apiCompleteEmployeeBooking,
    getEmployeeProfile,
    type EmployeeProfileBooking,
    type EmployeeProfileData
} from '@/api/EmployeePortal';
import {useUser} from '@/context/UserContext';

type EmployeePortalContextValue = {
    employee: EmployeeProfileData['employee'] | null;
    bookings: EmployeeProfileBooking[];
    completeBooking: (bookingId: number) => Promise<void>;
};

const EmployeePortalContext = createContext<EmployeePortalContextValue | undefined>(undefined);

export function EmployeePortalProvider({children}: PropsWithChildren) {
    const {loggedIn} = useAuth();
    const {user} = useUser();
    const [employee, setEmployee] = useState<EmployeeProfileData['employee'] | null>(null);
    const [bookings, setBookings] = useState<EmployeeProfileBooking[]>([]);

    useEffect(() => {
        void fetchPortalData();
    }, [loggedIn, user?.id]);

    async function fetchPortalData() {
        if (!loggedIn) {
            setEmployee(null);
            setBookings([]);
            return;
        }

        try {
            const response = await getEmployeeProfile();
            setEmployee(response.data.employee ?? null);
            setBookings(response.data.bookings ?? []);
        } catch {
            setEmployee(null);
            setBookings([]);
        }
    }

    async function completeBooking(bookingId: number) {
        await apiCompleteEmployeeBooking(bookingId);
        setBookings((prev) =>
            prev.map((booking) =>
                booking.id === bookingId ? { ...booking, completed_at: new Date().toISOString() } : booking
            )
        );
    }

    return (
        <EmployeePortalContext.Provider value={{employee, bookings, completeBooking}}>
            {children}
        </EmployeePortalContext.Provider>
    );
}

export function useEmployeePortal() {
    const context = useContext(EmployeePortalContext);
    if (!context) {
        throw new Error('useEmployeePortal must be used within EmployeePortalProvider');
    }
    return context;
}
