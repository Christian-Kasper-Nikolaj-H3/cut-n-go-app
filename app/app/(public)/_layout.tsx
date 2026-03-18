import { Drawer } from 'expo-router/drawer';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import {useEffect} from "react";
import { router } from 'expo-router';

export default function PublicLayout() {
    const { token, loggedIn, isLoading } = useAuth();

    useEffect(() => {
        if(loggedIn) {
            console.log("Logged in - redirecting to /(private)");
            router.push('/(private)');
        }
    }, [loggedIn]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Drawer>
            <Drawer.Screen
                name="booking"
                options={{
                    title: 'Booking',
                    drawerLabel: 'Booking'
                }}
            />

            <Drawer.Screen
                name="login"
                options={{
                    title: 'Login',
                    drawerLabel: 'Login',
                    drawerItemStyle: { display: token ? 'none' : 'flex' }
                }}
            />

            <Drawer.Screen
                name="register"
                options={{
                    title: 'Register',
                    drawerLabel: 'Register',
                    drawerItemStyle: { display: token ? 'none' : 'flex' }
                }}
            />

            <Drawer.Screen
                name="logout"
                options={{
                    title: 'Logout',
                    drawerLabel: 'Logout',
                    drawerItemStyle: { display: token ? 'flex' : 'none' }
                }}
            />
        </Drawer>
    );
}
