import {ApiError} from '@/api/core/errors';
import {getApiBaseUrl} from '@/api/core/config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TPayload> {
    method: HttpMethod;
    path: string;
    payload?: TPayload;
}

export async function requestJson<TResponse, TPayload = undefined>({ method, path, payload }: RequestOptions<TPayload>): Promise<TResponse> {
    let response: Response;
    try {
        response = await fetch(`${getApiBaseUrl()}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
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
