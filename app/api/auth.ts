import {postJson} from '@/api/core/client';
import { requestJson } from '@/api/core/request';

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    name: string;
    surname: string;
    password: string;
    phone: string;
    email: string;
}

export interface AuthResponse {
    token: string;
}

export interface AuthUser {
    id: number;
    username: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
    const response = await postJson<AuthResponse, LoginPayload>('/auth/login', payload);
    if (!response.token) {
        throw new Error('Token missing in auth response.');
    }
    return response;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await postJson<AuthResponse, RegisterPayload>('/auth/register', payload);
    if (!response.token) {
        throw new Error('Token missing in auth response.');
    }
    return response;
}

export async function getCurrentUserRequest(token: string): Promise<AuthUser> {
    return requestJson<AuthUser>({
        method: 'GET',
        path: '/user/me',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}