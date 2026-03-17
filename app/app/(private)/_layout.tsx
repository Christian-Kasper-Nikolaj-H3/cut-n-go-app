import { Redirect, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';


export default function TabLayout() {
    const { logout, token, isLoading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (isLoading) {
        return <ActivityIndicator style={{ marginTop: 32 }} />;
    }

    if (!token) {
        return <Redirect href="/(auth)/login" />;
    }

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
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
                headerRight: () =>
                    isLoggingOut ? (
                        <ActivityIndicator style={{ marginRight: 16 }} />
                    ) : (
                        <Pressable onPress={handleLogout} style={{ marginRight: 16 }}>
                            <Ionicons name="log-out-outline" size={22} color="#fff" />
                        </Pressable>
                    ),
            }}
        >

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home-sharp' : 'home-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="booking"
                options={{
                    title: 'Booking',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
