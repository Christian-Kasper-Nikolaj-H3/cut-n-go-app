import {getJson} from "@/api/core/methods";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface Booking {
    id?: number | string;
    salon_id?: string;
    date?: string;
}

export interface BookingResponse {
    success: boolean;
    data: {
        bookings: Booking[];
    }
}

export async function getMyBookings(): Promise<BookingResponse> {
    return getJson<BookingResponse>('/api/booking/all');
}