import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';

export default function LogoutScreen() {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = useCallback(async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    }, [isLoggingOut, logout]);

    useEffect(() => {
        void handleLogout();
    }, [handleLogout]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#be185d" />
            <Text style={styles.text}>Signing out...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffafc',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    text: {
        color: '#9d174d',
        fontWeight: '600',
    },
});