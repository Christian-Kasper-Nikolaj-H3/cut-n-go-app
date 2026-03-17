import { Redirect } from 'expo-router';

export default function PublicLoginRedirectPage() {
    return <Redirect href="/(auth)/login" />;
}