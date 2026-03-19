import { getJson } from "@/api/core/methods";
export { ApiError, AppConfigError } from "@/api/core/errors";

export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    salon: string;
    role: string;
}

export interface EmployeesResponse {
    success: boolean,
    data: {
        employees: Employee[]
    }
}

export async function getAllEmployees(): Promise<EmployeesResponse> {
    return getJson<EmployeesResponse>('/admin/employee/all');
}