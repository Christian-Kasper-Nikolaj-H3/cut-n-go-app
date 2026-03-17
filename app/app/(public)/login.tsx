import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function PublicLoginRedirectPage() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (token) {
        return <Redirect href="/(private)" />;
    }

    return <Redirect href="/(auth)/login" />;
}