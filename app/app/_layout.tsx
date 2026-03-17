import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <PaperProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </PaperProvider>
    );
}