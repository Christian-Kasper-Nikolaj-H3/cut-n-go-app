import {getJson} from "@/api/core/methods";

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface User {
    id: number;
    username: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
}

export async function getCurrentUser(): Promise<User> {
    return getJson<User>('/user/me');
}