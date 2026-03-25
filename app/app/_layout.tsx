import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { EmployeeProvider } from '@/context/EmployeeContext';
import { SalonProvider } from '@/context/SalonContext';
import { TreatmentProvider } from '@/context/TreatmentContext';

const appTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#be185d',
        background: '#fffafc',
        surface: '#ffffff',
        surfaceVariant: '#fde7f3',
        outline: '#f5c2d7',
        onSurface: '#18181b',
        onSurfaceVariant: '#71717a',
    },
};

function RootNavigator() {
    const { loggedIn, isLoading } = useAuth();

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
        <SafeAreaProvider>
            <PaperProvider theme={appTheme}>
                <AuthProvider>
                    <UserProvider>
                        <EmployeeProvider>
                            <SalonProvider>
                                <TreatmentProvider>
                                    <RootNavigator />
                                </TreatmentProvider>
                            </SalonProvider>
                        </EmployeeProvider>
                    </UserProvider>
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
