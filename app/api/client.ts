import { ApiError, AppConfigError } from '@/api/errors';

function getApiBaseUrl(): string {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
        throw new AppConfigError('EXPO_PUBLIC_API_URL is not configured.');
    }
    return baseUrl.replace(/\/+$/, '');
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TPayload> {
    method: HttpMethod;
    path: string;
    payload?: TPayload;
}

async function requestJson<TResponse, TPayload = undefined>({method, path, payload}: RequestOptions<TPayload>): Promise<TResponse> {
    let response: Response;
    try {
        response = await fetch(`${getApiBaseUrl()}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
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

export async function getJson<TResponse>(path: string): Promise<TResponse> {
    return requestJson<TResponse>({method: 'GET', path});
}

export async function postJson<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
    return requestJson<TResponse, TPayload>({method: 'POST', path, payload});
}

export async function putJson<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
    return requestJson<TResponse, TPayload>({method: 'PUT', path, payload});
}

export async function patchJson<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
    return requestJson<TResponse, TPayload>({method: 'PATCH', path, payload});
}

export async function deleteJson<TResponse>(path: string): Promise<TResponse> {
    return requestJson<TResponse>({method: 'DELETE', path});
}
