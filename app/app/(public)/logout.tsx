import { Redirect } from 'expo-router';

export default function PublicLogoutScreen() {
    return <Redirect href="/(private)/logout" />;
}
