import { Drawer } from 'expo-router/drawer';

export default function AuthLayout() {
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
