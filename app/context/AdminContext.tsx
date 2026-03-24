import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import {
    getAllEmployees as apiGetAllEmployees,
    type Employee
} from "@/api/Employee";

type AdminContextValue = {
    employees: Employee[];
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ employees, setEmployees ] = useState<Employee[]>([]);

    useEffect(() => {
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

    return (
        <AdminContext.Provider value={{ employees }}>
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
