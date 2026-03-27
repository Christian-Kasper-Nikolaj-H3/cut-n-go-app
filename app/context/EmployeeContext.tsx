import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import { useAuth } from "./AuthContext";
import {
    createEmployee as apiCreateEmployee,
    deleteEmployee as apiDeleteEmployee,
    getAllEmployees as apiGetAllEmployees,
    getEmployeeRoles as apiGetEmployeeRoles,
    updateEmployee as apiUpdateEmployee,
    type Employee,
    type EmployeeRole,
} from "@/api/Employee";

type EmployeeContextValue = {
    employees: Employee[];
    roles: EmployeeRole[];
    createEmployee: (payload: { role_id: number; salon_id: number; username: string }) => Promise<Employee>;
    updateEmployee: (
        id: number,
        payload: { role_id?: number; salon_id?: number; user_id?: number }
    ) => Promise<Employee>;
    deleteEmployee: (id: number) => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextValue | undefined>(undefined);

export function EmployeeProvider({children} : PropsWithChildren) {
    const { loggedIn } = useAuth();
    const [ employees, setEmployees ] = useState<Employee[]>([]);
    const [ roles, setRoles ] = useState<EmployeeRole[]>([]);

    useEffect(() => {
        void fetchEmployees();
        void fetchRoles();
    }, []);

    async function fetchEmployees() {

        try {
            const response = await apiGetAllEmployees();
            setEmployees(response.data.employees ?? []);
        } catch {
            setEmployees([]);
        }
    }

    async function fetchRoles() {

        try {
            const response = await apiGetEmployeeRoles();
            setRoles(response.data.roles ?? []);
        } catch {
            setRoles([]);
        }
    }

    async function createEmployee(payload: { role_id: number; salon_id: number; username: string }) {
        const response = await apiCreateEmployee(payload);
        const created = response.data.employee;
        setEmployees((prev) => [created, ...prev]);
        return created;
    }

    async function updateEmployee(
        id: number,
        payload: { role_id?: number; salon_id?: number; user_id?: number }
    ) {
        const response = await apiUpdateEmployee(id, payload);
        const updated = response.data.employee;
        setEmployees((prev) => prev.map((employee) => (employee.id === id ? updated : employee)));
        return updated;
    }

    async function deleteEmployee(id: number) {
        await apiDeleteEmployee(id);
        setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    }

    return (
        <EmployeeContext.Provider value={{ employees, roles, createEmployee, updateEmployee, deleteEmployee }}>
            {children}
        </EmployeeContext.Provider>
    );
}

export const useEmployee = () => {
    const context = useContext(EmployeeContext);
    if(!context) {
        throw new Error('useEmployee must be used within EmployeeProvider');
    }
    return context;
}
