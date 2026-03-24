import {deleteJson, getJson, postJson, putJson} from "@/api/core/client";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface Salon {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

export interface MultipleSalonResponse {
    success: boolean;
    message?: string;
    data: {
        salons: Salon[];
    };
}

export interface CreateSalonPayload {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

export interface SingleSalonResponse {
    success: boolean;
    message: string;
    data: {
        salon: Salon;
    };
}

export async function getAllSalons(): Promise<MultipleSalonResponse> {
    return getJson<MultipleSalonResponse>('/api/salon/all');
}

export async function createSalon(
    name: string,
    address: string,
    city: string,
    phone: string,
    email: string
): Promise<SingleSalonResponse> {
    const payload: CreateSalonPayload = {name, address, city, phone, email};
    return postJson<SingleSalonResponse, CreateSalonPayload>('/api/salon/new', payload);
}

export async function updateSalon(
    id: number,
    name: string,
    address: string,
    city: string,
    phone: string,
    email: string
): Promise<SingleSalonResponse> {
    const payload: CreateSalonPayload = {name, address, city, phone, email};
    return putJson<SingleSalonResponse, CreateSalonPayload>(`/api/salon/update/${id}`, payload);
}

export async function deleteSalon(id: number): Promise<{ success: boolean; message: string }> {
    return deleteJson<{ success: boolean; message: string }>(`/api/salon/delete/${id}`);
}
