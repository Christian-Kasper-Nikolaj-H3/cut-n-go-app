import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import {
    createSalon as apiCreateSalon,
    deleteSalon as apiDeleteSalon,
    getAllSalons as apiGetAllSalons,
    updateSalon as apiUpdateSalon,
    type Salon
} from "@/api/Salon";

type SalonContextValue = {
    salons: Salon[];
    createSalon: (name: string, address: string, city: string, phone: string, email: string) => Promise<Salon>;
    updateSalon: (id: number, name: string, address: string, city: string, phone: string, email: string) => Promise<Salon>;
    deleteSalon: (id: number) => Promise<void>;
}

const SalonContext = createContext<SalonContextValue | undefined>(undefined);

export function SalonProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ salons, setSalons ] = useState<Salon[]>([]);

    useEffect(() => {
        void fetchSalons();
    }, [loggedIn]);

    async function fetchSalons() {
        if(!loggedIn) {
            setSalons([]);
            return;
        }

        try {
            const response = await apiGetAllSalons();
            setSalons(response.data.salons ?? []);
        } catch {
            setSalons([]);
        }
    }

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
        <SalonContext.Provider value={{ salons, createSalon, updateSalon, deleteSalon }}>
            {children}
        </SalonContext.Provider>
    );
}

export const useSalon = () => {
    const context = useContext(SalonContext);
    if(!context) {
        throw new Error('useSalon must be used within SalonProvider');
    }
    return context;
}
