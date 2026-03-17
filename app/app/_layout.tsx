import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
    return (
        <PaperProvider>
            <AuthProvider>
                <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/register" />
                </Stack>
            </AuthProvider>
        </PaperProvider>
    );
}