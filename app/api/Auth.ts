import {postJson} from '@/api/core/client';

export {ApiError, AppConfigError} from '@/api/core/errors';

export interface User {
    id: number;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
    email: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User
    }
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
    const response = await postJson<AuthResponse, LoginPayload>('/auth/login', payload);
    if (!response.data.token) {
        throw new Error('Token missing in auth response.');
    }
    return response;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await postJson<AuthResponse, RegisterPayload>('/auth/register', payload);
    console.log(response);

    if (!response.data.token) {
        throw new Error('Token missing in auth response.');
    }
    return response;
}