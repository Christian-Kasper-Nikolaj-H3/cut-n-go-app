import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
    return (
        <PaperProvider>
            <AuthProvider>
                <Stack initialRouteName="(public)" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(public)" />
                    <Stack.Screen name="(private)" />
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/register" />
                </Stack>
            </AuthProvider>
        </PaperProvider>
    );
}