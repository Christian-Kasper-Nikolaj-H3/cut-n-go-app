import { Drawer } from 'expo-router/drawer';

export default function TabLayout() {
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
