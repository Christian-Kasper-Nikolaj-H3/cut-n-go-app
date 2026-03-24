import {deleteJson, getJson, postJson, putJson} from "@/api/core/client";
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
    id: number;
    name: string;
}

export interface EmployeesResponse {
    success: boolean;
    message: string;
    data: {
        employees: Employee[]
    }
}

export interface EmployeeRolesResponse {
    success: boolean;
    message: string;
    data: {
        roles: EmployeeRole[]
    }
}

export interface CreateEmployeePayload {
    role_id: number;
    salon_id: number;
    username: string;
}

export interface UpdateEmployeePayload {
    role_id?: number;
    salon_id?: number;
    user_id?: number;
}

export interface EmployeeResponse {
    success: boolean;
    message: string;
    data: {
        employee: Employee;
    };
}

export interface DeleteEmployeeResponse {
    success: boolean;
    message: string;
}

export async function getAllEmployees(): Promise<EmployeesResponse> {
    return getJson<EmployeesResponse>('/api/employee/all');
}

export async function getEmployeeRoles(): Promise<EmployeeRolesResponse> {
    return getJson<EmployeeRolesResponse>('/api/employee/roles');
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<EmployeeResponse> {
    return postJson<EmployeeResponse, CreateEmployeePayload>('/api/employee/new', payload);
}

export async function updateEmployee(id: number, payload: UpdateEmployeePayload): Promise<EmployeeResponse> {
    return putJson<EmployeeResponse, UpdateEmployeePayload>(`/api/employee/update/${id}`, payload);
}

export async function deleteEmployee(id: number): Promise<DeleteEmployeeResponse> {
    return deleteJson<DeleteEmployeeResponse>(`/api/employee/delete/${id}`);
}
