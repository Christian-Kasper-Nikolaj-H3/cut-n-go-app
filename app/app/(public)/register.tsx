import { Redirect } from 'expo-router';

export default function PublicRegisterRedirectPage() {
    return <Redirect href={'/(auth)/register'} />;
}
