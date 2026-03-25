import {deleteJson, getJson, postJson, putJson} from "@/api/core/client";

export interface TreatmentCategory {
    id: number;
    title: string;
    description: string | null;
}

export interface Treatment {
    id: number;
    category_id: number;
    name: string;
    price: string;
    category?: TreatmentCategory;
}

export interface TreatmentsResponse {
    success: boolean;
    message: string;
    data: {
        treatments: Treatment[];
    };
}

export interface TreatmentCategoriesResponse {
    success: boolean;
    message: string;
    data: {
        categories: TreatmentCategory[];
    };
}

export interface CreateTreatmentPayload {
    category_id: number;
    name: string;
    price: number;
}

export interface UpdateTreatmentPayload {
    category_id?: number;
    name?: string;
    price?: number;
}

export interface CreateTreatmentCategoryPayload {
    title: string;
    description?: string | null;
}

export interface TreatmentResponse {
    success: boolean;
    message: string;
    data: {
        treatment: Treatment;
    };
}

export interface DeleteTreatmentResponse {
    success: boolean;
    message: string;
}

export interface TreatmentCategoryResponse {
    success: boolean;
    message: string;
    data: {
        category: TreatmentCategory;
    };
}

export interface UpdateTreatmentCategoryPayload {
    title?: string;
    description?: string | null;
}

export async function getAllTreatments(): Promise<TreatmentsResponse> {
    return getJson<TreatmentsResponse>('/api/treatment/all');
}

export async function getTreatmentCategories(): Promise<TreatmentCategoriesResponse> {
    return getJson<TreatmentCategoriesResponse>('/api/treatment/categories');
}

export async function createTreatment(payload: CreateTreatmentPayload): Promise<TreatmentResponse> {
    return postJson<TreatmentResponse, CreateTreatmentPayload>('/api/treatment/new', payload);
}

export async function updateTreatment(id: number, payload: UpdateTreatmentPayload): Promise<TreatmentResponse> {
    return putJson<TreatmentResponse, UpdateTreatmentPayload>(`/api/treatment/update/${id}`, payload);
}

export async function deleteTreatment(id: number): Promise<DeleteTreatmentResponse> {
    return deleteJson<DeleteTreatmentResponse>(`/api/treatment/delete/${id}`);
}

export async function createTreatmentCategory(
    payload: CreateTreatmentCategoryPayload
): Promise<TreatmentCategoryResponse> {
    return postJson<TreatmentCategoryResponse, CreateTreatmentCategoryPayload>('/api/treatment/categories/new', payload);
}

export async function updateTreatmentCategory(
    id: number,
    payload: UpdateTreatmentCategoryPayload
): Promise<TreatmentCategoryResponse> {
    return putJson<TreatmentCategoryResponse, UpdateTreatmentCategoryPayload>(`/api/treatment/categories/update/${id}`, payload);
}

export async function deleteTreatmentCategory(id: number): Promise<DeleteTreatmentResponse> {
    return deleteJson<DeleteTreatmentResponse>(`/api/treatment/categories/delete/${id}`);
}
