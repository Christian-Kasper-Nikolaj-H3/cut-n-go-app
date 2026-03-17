import {AppConfigError} from '@/api/core/errors';

export function getApiBaseUrl(): string {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
        throw new AppConfigError('EXPO_PUBLIC_API_URL is not configured.');
    }
    return baseUrl.replace(/\/+$/, '');
}
