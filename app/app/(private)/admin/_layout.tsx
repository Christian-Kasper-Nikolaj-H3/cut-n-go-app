import {Drawer} from 'expo-router/drawer';

export default function AdminLayout() {
    return (
        <Drawer
            screenOptions={{
                headerShown: true
            }}
        >
            <Drawer.Screen
                name="index"
                options={{
                    title: 'Admin',
                    drawerLabel: 'Overview',
                }}
            />

            <Drawer.Screen
                name="salons"
                options={{
                    title: 'Saloner',
                    drawerLabel: 'Saloner',
                }}
            />

            <Drawer.Screen
                name="employees"
                options={{
                    title: 'Medarbejdere',
                    drawerLabel: 'Medarbejdere',
                }}
            />
        </Drawer>
    );
}
