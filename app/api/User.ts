import {getJson} from "@/api/core/methods";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface User {
    id: number;
    username: string;
    is_admin: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
}

export interface UserResponse {
    success: boolean;
    data: User;
}

export interface UserBookingReponse {
    success: boolean;
    message: string;
    data: {
        bookings: Booking[];
    }
}

export interface Booking {
    id: number;
    date: string;
    completed_at?: string | null;
    employee: {
        id: number;
        user: {
            id: number;
            information: {
                first_name: string;
                last_name: string;
            }
        }
    };
    salon: {
        name: string;
        address: string;
        city: string;
        phone: string;
        email: string;
    }
}

export async function getCurrentUser(): Promise<UserResponse> {
    return await getJson<UserResponse>('/api/user/me');
}

export async function getUserBookings(): Promise<UserBookingReponse> {
    return await getJson<UserBookingReponse>('/api/user/bookings');
}
