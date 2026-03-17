import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LogoutScreen() {
    const { logout, token, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && token) {
            void logout();
        }
    }, [isLoading, token, logout]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!token) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    );
}
