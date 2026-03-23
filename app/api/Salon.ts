import { getJson } from "@/api/core/methods";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface Salon {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

export interface SalonResponse {
    success: boolean;
    data: {
        salons: Salon[];
    }
}

export async function getAllSalons(): Promise<SalonResponse> {
    return await getJson<SalonResponse>('/api/salon/all');
}
