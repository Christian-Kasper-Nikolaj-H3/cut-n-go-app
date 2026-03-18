import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native';
import {useEffect} from "react";
import {router} from "expo-router";
import {useAuth} from "@/context/AuthContext";

export default function AuthLayout() {
    const {loggedIn} = useAuth();
    useEffect(() => {
        if(loggedIn) {
            console.log("Logged in - redirecting to /(private)");
            router.push('/(private)');
        }
    }, [loggedIn]);

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
                    drawerLabel: 'Login'
                }}
            />

            <Drawer.Screen
                name="register"
                options={{
                    title: 'Register',
                    drawerLabel: 'Register'
                }}
            />
        </Drawer>
    );
}
