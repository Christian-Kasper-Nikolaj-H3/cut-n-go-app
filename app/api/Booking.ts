import {getJson, postJson} from "@/api/core/methods";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface BookingResponse {
    success: boolean;
    data: {
        bookings?: Booking[];
        booking?: Booking;
        availableTimes?: AvailableTime[];
    }
}

export interface Booking {
    id?: number | string;
    salon_id?: string;
    employee_id?: string;
    date?: string;
}

export interface AvailableTime {
    available_times: string;
}

export interface NewBookingPayload {
    salon_id: string;
    employee_id: string;
    date: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
}

export interface BookingTimesPayload {
    salon_id: string;
    employee_id: string;
    date: string;
}

export async function getMyBookings(): Promise<BookingResponse> {
    return getJson<BookingResponse>('/api/booking/all');
}

export async function getAvailableTimes(payload: BookingTimesPayload): Promise<BookingResponse> {
    const query = new URLSearchParams({
        salon_id: payload.salon_id,
        employee_id: payload.employee_id,
        date: payload.date,
    });
    return await getJson<BookingResponse>(`/api/booking/available-times?${query.toString()}`);
}

export async function newBooking(payload: NewBookingPayload): Promise<BookingResponse> {
    return postJson<BookingResponse, NewBookingPayload>('/api/booking/new', payload);
}