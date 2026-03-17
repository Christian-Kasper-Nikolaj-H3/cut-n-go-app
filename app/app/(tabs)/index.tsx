import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Index() {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        if (isLoggingOut) {
            return;
        }
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>You are logged in.</Text>
            <Button mode="contained" onPress={handleLogout} loading={isLoggingOut} disabled={isLoggingOut}>
                Sign out
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
});
