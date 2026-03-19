import {deleteJson, getJson, postJson, putJson} from "@/api/core/methods";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface SalonsResponse {
    success: boolean;
    data: {
        salons: Salon[];
    }
}

export interface SalonResponse {
    success: boolean;
    data: {
        salon: Salon;
    }
}

export interface DeleteSalonResponse {
    success: boolean;
    message: string;
}

export interface Salon {
    id?: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

export async function getAllSalons(): Promise<SalonsResponse> {
    return getJson<SalonsResponse>('/admin/salon/all');
}

export async function createSalon(
    name: string,
    address: string,
    city: string,
    phone: string,
    email: string
): Promise<SalonResponse> {
    const salon: Salon = {
        name,
        address,
        city,
        phone,
        email
    };

    return postJson<SalonResponse, Salon>('/admin/salon/new', salon);
}

export async function updateSalon(
    id: number,
    name: string,
    address: string,
    city: string,
    phone: string,
    email: string
): Promise<SalonResponse> {
    const salon: Salon = {
        name,
        address,
        city,
        phone,
        email
    };

    return putJson<SalonResponse, Salon>(`/admin/salon/update/${id}`, salon);
}

export async function deleteSalon(id: number): Promise<DeleteSalonResponse> {
    return deleteJson<DeleteSalonResponse>(`/admin/salon/delete/${id}`);
}
