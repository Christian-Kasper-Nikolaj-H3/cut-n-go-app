import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import { useUser } from "./UserContext";
import {
    createSalon as apiCreateSalon,
    deleteSalon as apiDeleteSalon,
    getAllSalons as apiGetAllSalons,
    updateSalon as apiUpdateSalon,
    type Salon
} from "@/api/Salon";
import {
    getAllEmployees as apiGetAllEmployees,
    type Employee
} from "@/api/Employee";

type AdminContextValue = {
    salons: Salon[];
    employees: Employee[];
    createSalon: (name: string, address: string, city: string, phone: string, email: string) => Promise<Salon>;
    updateSalon: (id: number, name: string, address: string, city: string, phone: string, email: string) => Promise<Salon>;
    deleteSalon: (id: number) => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ salons, setSalons ] = useState<Salon[]>([]);
    const [ employees, setEmployees ] = useState<Employee[]>([]);

    useEffect(() => {
        void fetchSalons();
        void fetchEmployees();
    }, [loggedIn])

    async function fetchEmployees() {
        if(!loggedIn) {
            setEmployees([]);
            return;
        }

        try {
            const response = await apiGetAllEmployees();
            setEmployees(response.data.employees ?? []);
        } catch {
            setEmployees([]);
        }
    }

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
        <AdminContext.Provider value={{ employees, salons, createSalon, updateSalon, deleteSalon }}>
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
