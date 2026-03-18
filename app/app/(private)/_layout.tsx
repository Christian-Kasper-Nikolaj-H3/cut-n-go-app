import { Drawer } from 'expo-router/drawer';
import {useEffect} from "react";
import {router} from "expo-router";
import {useAuth} from "@/context/AuthContext";

export default function TabLayout() {
    const {loggedIn} = useAuth();

    useEffect(() => {
        if(!loggedIn) {
            console.log("Not logged in - redirecting to /(public)");
            // @ts-ignore
            router.push('/(public)');
        }
    }, [loggedIn]);

    return (
        <Drawer>
            <Drawer.Screen
                name="index"
                options={{
                    title: 'Home',
                    drawerLabel: 'Home'
                }}
            />

            <Drawer.Screen
                name="booking"
                options={{
                    title: 'Booking',
                    drawerLabel: 'Booking'
                }}
            />

            <Drawer.Screen
                name="logout"
                options={{
                    title: 'Logout',
                    drawerLabel: 'Logout'
                }}
            />
        </Drawer>
    );
}
