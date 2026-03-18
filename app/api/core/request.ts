import {ApiError} from '@/api/core/errors';
import {getApiBaseUrl} from '@/api/core/config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type AuthTokenProvider = () => string | null;

let authTokenProvider: AuthTokenProvider = () => null;

export function setAuthTokenProvider(provider: AuthTokenProvider) {
    authTokenProvider = provider;
}

interface RequestOptions<TPayload> {
    method: HttpMethod;
    path: string;
    payload?: TPayload;
    token?: string;
    headers?: Record<string, string>;
}

export async function requestJson<TResponse, TPayload = undefined>({
    method,
    path,
    payload,
    token,
    headers,
}: RequestOptions<TPayload>): Promise<TResponse> {
    let response: Response;
    const resolvedToken = token ?? authTokenProvider();
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (resolvedToken) {
        requestHeaders.Authorization = `Bearer ${resolvedToken}`;
    }

    try {
        response = await fetch(`${getApiBaseUrl()}${path}`, {
            method,
            headers: requestHeaders,
            body: payload === undefined ? undefined : JSON.stringify(payload),
        });
    } catch {
        throw new ApiError('Network request failed', 0);
    }

    const responseText = await response.text();
    let responseBody: TResponse | null = null;
    if (responseText) {
        try {
            responseBody = JSON.parse(responseText) as TResponse;
        } catch {
            responseBody = null;
        }
    }

    if (!response.ok) {
        const errorBody = responseBody as { status?: string } | null;
        throw new ApiError(errorBody?.status ?? response.statusText ?? 'Request failed', response.status);
    }

    if (!responseBody) {
        throw new Error('Empty response body.');
    }

    return responseBody;
}
