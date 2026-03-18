import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
    const insets = useSafeAreaInsets();
    const {loggedIn} = useAuth();

    useEffect(() => {
        if(loggedIn) {
            console.log("Logged in - redirecting to /(private)");
            router.push('/(private)');
        }
    }, [loggedIn]);

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: '#f5c2d7' }]}>
            <Stack screenOptions={{ headerShown: false }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
