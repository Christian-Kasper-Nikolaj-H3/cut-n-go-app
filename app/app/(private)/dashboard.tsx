import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {ActivityIndicator, Card, Chip, Text} from 'react-native-paper';
import { useUser } from '@/context/UserContext';
import {UserBookingCard} from "@/components/UserBookingCard/UserBookingCard";
import {useEffect, useState} from "react";
import {Booking} from "@/api/User";

export default function DashboardScreen() {
    const { user, bookings: userBookings, bookingsLoading } = useUser();
    const [ upcoming, setUpcoming ] = useState<Booking[]>([]);
    const [ completed, setCompleted ] = useState<Booking[]>([]);

    useEffect(() => {
        function filterBookings() {
            if(!userBookings) return;
            const now = new Date();

            setUpcoming(
                userBookings.filter((booking) => !booking.completed_at && new Date(booking.date) > now)
            );
            setCompleted(
                userBookings.filter((booking) => !!booking.completed_at || new Date(booking.date) < now)
            );
        }

        filterBookings();
    }, [user, userBookings]);

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.heroCard}>
                    <Card.Content style={styles.heroContent}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Mine tider
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Hej {user?.first_name || user?.username || 'igen'} — her er dine kommende og
                            afsluttede bookinger.
                        </Text>

                        <View style={styles.summaryRow}>
                            <View style={styles.summaryBox}>
                                <Text variant="labelMedium" style={styles.summaryLabel}>
                                    Kommende
                                </Text>
                                <Text variant="headlineSmall" style={styles.summaryValue}>
                                    {upcoming.length}
                                </Text>
                            </View>

                            <View style={styles.summaryBox}>
                                <Text variant="labelMedium" style={styles.summaryLabel}>
                                    Afsluttede
                                </Text>
                                <Text variant="headlineSmall" style={styles.summaryValue}>
                                    {completed.length}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {bookingsLoading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator animating size="large" color="#be185d" />
                        <Text variant="bodyMedium" style={styles.loadingText}>
                            Henter bookinger...
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>
                                Kommende bookinger
                            </Text>
                            <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                                {upcoming!.length}
                            </Chip>
                        </View>
                        {upcoming && upcoming.map((booking) => (
                            <UserBookingCard
                                key={booking.id}
                                booking={booking}
                                status={"upcoming"}
                            />
                        ))}

                        <View style={styles.sectionHeader}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>
                                Afsluttede bookinger
                            </Text>
                            <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                                {completed!.length}
                            </Chip>
                        </View>
                        {completed && completed.map((booking) => (
                            <UserBookingCard
                                key={booking.id}
                                booking={booking}
                                status={"completed"}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 18,
        paddingBottom: 32,
    },
    heroCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    heroContent: {
        padding: 24,
        gap: 14,
    },
    title: {
        color: '#be185d',
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#52525b',
        opacity: 0.8,
        lineHeight: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
    },
    summaryBox: {
        flex: 1,
        backgroundColor: '#fff7fb',
        borderWidth: 1,
        borderColor: '#f5c2d7',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    summaryLabel: {
        color: '#9d174d',
        marginBottom: 4,
    },
    summaryValue: {
        color: '#be185d',
        fontWeight: '700',
    },
    statusText: {
        textAlign: 'center',
        color: '#71717a',
    },
    loadingWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    loadingText: {
        color: '#71717a',
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    sectionTitle: {
        color: '#9d174d',
        fontWeight: '700',
        flex: 1,
    },
    countChip: {
        backgroundColor: '#fdf2f8',
        borderColor: '#f5c2d7',
    },
    countChipText: {
        color: '#be185d',
        fontWeight: '700',
    },
    bookingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    bookingCardContent: {
        padding: 18,
        gap: 10,
    },
    bookingCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    bookingTitle: {
        color: '#be185d',
        fontWeight: '700',
        flex: 1,
    },
    divider: {
        backgroundColor: '#fce7f3',
    },
    infoRow: {
        gap: 4,
    },
    infoLabel: {
        color: '#9d174d',
        fontWeight: '700',
    },
    infoValue: {
        color: '#52525b',
    },
    statusChip: {
        borderWidth: 1,
    },
    statusChipUpcoming: {
        backgroundColor: '#ecfdf5',
        borderColor: '#86efac',
    },
    statusChipCompleted: {
        backgroundColor: '#f3f4f6',
        borderColor: '#d1d5db',
    },
    statusChipText: {
        fontWeight: '700',
        color: '#374151',
    },
    emptyCard: {
        backgroundColor: '#fffafc',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#fce7f3',
    },
    emptyText: {
        textAlign: 'center',
        color: '#71717a',
    },
    errorSnackbar: {
        backgroundColor: '#991b1b',
    },
});
