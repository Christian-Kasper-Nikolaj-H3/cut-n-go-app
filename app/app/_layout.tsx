import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function RootNavigator() {
    const { token, loggedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Stack initialRouteName="(public)" screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!loggedIn}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Screen name="(public)" />
            <Stack.Protected guard={loggedIn}>
                <Stack.Screen name="(private)" />
            </Stack.Protected>
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
