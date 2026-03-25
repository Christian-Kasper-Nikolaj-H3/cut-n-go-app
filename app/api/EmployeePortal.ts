import {getJson, putJson} from '@/api/core/client';

export interface EmployeeProfileBooking {
    id: number;
    date: string;
    completed_at?: string | null;
    treatments?: {
        id: number;
        name: string;
        price: string;
    }[];
    salon?: {
        id: number;
        name: string;
        address: string;
        city: string;
        phone: string;
        email: string;
    };
    information?: {
        first_name: string;
        last_name: string;
        phone: string;
        email: string;
        user?: {
            id: number;
            information?: {
                first_name: string;
                last_name: string;
            };
        };
    };
}

export interface EmployeeProfileData {
    employee: {
        id: number;
        role_id: number;
        salon_id: number;
        user_id: number;
        user: {
            id: number;
            username: string;
            information: {
                first_name: string;
                last_name: string;
                phone: string;
                email: string;
            };
        };
        salon: {
            id: number;
            name: string;
            address: string;
            city: string;
            phone: string;
            email: string;
        };
        role: {
            id: number;
            name: string;
        };
    };
    bookings: EmployeeProfileBooking[];
}

export interface EmployeeProfileResponse {
    success: boolean;
    message: string;
    data: EmployeeProfileData;
}

export interface CompleteEmployeeBookingResponse {
    success: boolean;
    message: string;
    data: {
        booking: {
            id: number;
            completed_at: string;
        };
    };
}

export async function getEmployeeProfile(): Promise<EmployeeProfileResponse> {
    return getJson<EmployeeProfileResponse>('/api/employee/me');
}

export async function completeEmployeeBooking(bookingId: number): Promise<CompleteEmployeeBookingResponse> {
    return putJson<CompleteEmployeeBookingResponse, Record<string, never>>(
        `/api/employee/bookings/${bookingId}/complete`,
        {}
    );
}
