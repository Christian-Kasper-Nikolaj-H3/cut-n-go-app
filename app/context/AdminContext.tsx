import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import { useUser } from "./UserContext";
import {
    createSalon as apiCreateSalon,
    deleteSalon as apiDeleteSalon,
    getAllSalons,
    type Salon,
    updateSalon as apiUpdateSalon
} from "@/api/Salon";

type AdminContextValue = {
    salons: Salon[];
    createSalon: (name: string, address: string, city: string, phone: string, email: string) => Promise<Salon>;
    updateSalon: (id: number, name: string, address: string, city: string, phone: string, email: string) => Promise<Salon>;
    deleteSalon: (id: number) => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const { user } = useUser();
    const [ salons, setSalons ] = useState<Salon[]>([]);

    useEffect(() => {
        async function fetchSalons() {
            if(!loggedIn || !user?.isAdmin) {
                setSalons([]);
                return;
            }

            const response = await getAllSalons();
            setSalons(response.data.salons ?? []);
        }

        void fetchSalons();
    }, [loggedIn, user?.isAdmin])

    async function createSalon(name: string, address: string, city: string, phone: string, email: string) {
        const res = await apiCreateSalon(name, address, city, phone, email);
        const created = res.data.salon;
        setSalons((prev) => [created, ...prev]);
        return created;
    }

    async function updateSalon(id: number, name: string, address: string, city: string, phone: string, email: string) {
        const res = await apiUpdateSalon(id, name, address, city, phone, email);
        const updated = res.data.salon;
        setSalons((prev) => prev.map((salon) => (salon.id === id ? updated : salon)));
        return updated;
    }

    async function deleteSalon(id: number) {
        await apiDeleteSalon(id);
        setSalons((prev) => prev.filter((salon) => salon.id !== id));
    }

    return (
        <AdminContext.Provider value={{ salons, createSalon, updateSalon, deleteSalon }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if(!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
}
