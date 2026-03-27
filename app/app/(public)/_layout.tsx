import { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function PublicLayout() {
    const insets = useSafeAreaInsets();
    const { loggedIn } = useAuth();

    useEffect(() => {
        if(loggedIn) {
            console.log("Logged in - redirecting to /(private)");
            router.push('/(private)/dashboard');
        }
    }, [loggedIn]);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#be185d',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#f5c2d7',
                    borderTopWidth: 1,
                    minHeight: 56 + insets.bottom,
                    paddingTop: 6,
                    paddingBottom: Math.max(insets.bottom, 8),
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                sceneStyle: {
                    backgroundColor: '#f5c2d7',
                    paddingTop: insets.top,
                }
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

            <Tabs.Screen
                name="login"
                options={{
                    title: 'Login',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'log-in' : 'log-in-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="register"
                options={{
                    title: 'Register',
                    href: null,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'log-in' : 'log-in-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}