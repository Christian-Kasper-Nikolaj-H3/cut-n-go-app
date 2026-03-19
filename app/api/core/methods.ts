import {requestJson} from '@/api/core/request';

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
    return requestJson<TResponse>({method: 'DELETE', path, allowEmptyResponse: true});
}
