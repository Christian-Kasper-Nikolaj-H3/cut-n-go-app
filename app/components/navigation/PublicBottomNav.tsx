import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PublicBottomNavProps = {
    activeTab: 'home' | 'booking' | 'login';
};

type NavItemProps = {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
    onPress: () => void;
};

function NavItem({ label, icon, isActive, onPress }: NavItemProps) {
    return (
        <Pressable onPress={onPress} style={styles.item}>
            <Ionicons
                name={icon}
                size={24}
                color={isActive ? '#be185d' : '#9ca3af'}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
                {label}
            </Text>
        </Pressable>
    );
}

export function PublicBottomNav({ activeTab }: PublicBottomNavProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: Math.max(insets.bottom, 8),
                    height: 56 + Math.max(insets.bottom, 8),
                },
            ]}
        >
            <NavItem
                label="Home"
                icon={activeTab === 'home' ? 'home-sharp' : 'home-outline'}
                isActive={activeTab === 'home'}
                onPress={() => router.replace('/(public)')}
            />

            <NavItem
                label="Booking"
                icon={activeTab === 'booking' ? 'calendar' : 'calendar-outline'}
                isActive={activeTab === 'booking'}
                onPress={() => router.replace('/(public)/booking')}
            />

            <NavItem
                label="Login"
                icon={activeTab === 'login' ? 'log-in' : 'log-in-outline'}
                isActive={activeTab === 'login'}
                onPress={() => router.replace('/(public)/login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopColor: '#f5c2d7',
        borderTopWidth: 1,
        height: 64,
        paddingTop: 6,
        paddingBottom: 8,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
    },
    labelActive: {
        color: '#be185d',
    },
});