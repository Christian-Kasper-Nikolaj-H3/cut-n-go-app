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
                    title: 'Salons',
                    drawerLabel: 'Salons',
                }}
            />
        </Drawer>
    );
}
