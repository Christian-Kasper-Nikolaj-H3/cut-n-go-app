import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';


export default function TabLayout() {
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
                    height: 64,
                    paddingTop: 6,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                sceneStyle: {
                    backgroundColor: 'transparent',
                },
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
                name="logout"
                options={{
                    title: 'Logout',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'log-out' : 'log-out-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
