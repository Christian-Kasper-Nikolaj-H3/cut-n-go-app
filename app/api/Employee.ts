import { getJson } from "@/api/core/methods";
export { ApiError, AppConfigError } from "@/api/core/errors";

export interface User {
    id: number;
    username: string;
    information: UserInformation;
}

export interface UserInformation {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
}

export interface Salon {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

export interface Employee {
    id: number;
    role_id: number;
    salon_id: number;
    user_id: number;
    user: User;
    salon: Salon;
    role: EmployeeRole;
}

export interface EmployeeRole {
    name: string;
}

export interface EmployeesResponse {
    success: boolean;
    message: string;
    data: {
        employees: Employee[]
    }
}

export async function getAllEmployees(): Promise<EmployeesResponse> {
    return await getJson<EmployeesResponse>('/api/employee/all');
}