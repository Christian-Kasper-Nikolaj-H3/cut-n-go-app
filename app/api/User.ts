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

export async function getCurrentUser(): Promise<UserResponse> {
    return await getJson<UserResponse>('/api/user/me');
}
