import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ActivityIndicator,
    Card,
    Chip,
    Divider,
    Snackbar,
    Text,
} from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

type Booking = {
    Id?: number | string;
    SalonID?: number | string;
    BestillingDato?: string;
};

type MessageState = {
    type: 'error' | 'success';
    text: string;
} | null;

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function DashboardScreen() {
    const { token, user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [message, setMessage] = useState<MessageState>(null);

    const formatDate = useCallback((value?: string) => {
        if (!value) {
            return 'Ukendt dato';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return 'Ukendt dato';
        }

        return date.toLocaleString('da-DK', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    }, []);

    const loadBookings = useCallback(async (refresh = false) => {
        if (!token || !BASE_URL) {
            setBookings([]);
            setIsLoading(false);
            setIsRefreshing(false);
            return;
        }

        if (refresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await fetch(`${BASE_URL}/user/bookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.status || 'Kunne ikke hente bookinger.');
            }

            setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
        } catch (error) {
            setBookings([]);
            setMessage({
                type: 'error',
                text: error instanceof Error
                    ? error.message
                    : 'Der opstod en fejl ved hentning af bookinger.',
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [token]);

    useEffect(() => {
        void loadBookings();
    }, [loadBookings]);

    useFocusEffect(
        useCallback(() => {
            void loadBookings(true);
        }, [loadBookings])
    );

    const { upcomingBookings, completedBookings } = useMemo(() => {
        const now = new Date();

        const validBookings = bookings.filter((booking) => {
            const date = new Date(booking.BestillingDato ?? '');
            return !Number.isNaN(date.getTime());
        });

        return {
            upcomingBookings: validBookings
                .filter((booking) => new Date(booking.BestillingDato as string) > now)
                .sort(
                    (a, b) =>
                        new Date(a.BestillingDato as string).getTime() -
                        new Date(b.BestillingDato as string).getTime()
                ),
            completedBookings: validBookings
                .filter((booking) => new Date(booking.BestillingDato as string) <= now)
                .sort(
                    (a, b) =>
                        new Date(b.BestillingDato as string).getTime() -
                        new Date(a.BestillingDato as string).getTime()
                ),
        };
    }, [bookings]);

    const statusText = useMemo(() => {
        if (isLoading) {
            return 'Henter bookinger...';
        }

        if (bookings.length === 0) {
            return 'Du har ingen bookinger endnu.';
        }

        return `Du har ${upcomingBookings.length} kommende og ${completedBookings.length} afsluttede bookinger.`;
    }, [bookings.length, completedBookings.length, isLoading, upcomingBookings.length]);

    function renderBookingCard(booking: Booking, type: 'upcoming' | 'completed') {
        return (
            <Card
                key={`${booking.Id ?? 'booking'}-${booking.BestillingDato ?? Math.random()}`}
                style={styles.bookingCard}
            >
                <Card.Content style={styles.bookingCardContent}>
                    <View style={styles.bookingCardHeader}>
                        <Text variant="titleMedium" style={styles.bookingTitle}>
                            Ordre #{booking.Id ?? '—'}
                        </Text>
                        <Chip
                            compact
                            style={[
                                styles.statusChip,
                                type === 'upcoming'
                                    ? styles.statusChipUpcoming
                                    : styles.statusChipCompleted,
                            ]}
                            textStyle={styles.statusChipText}
                        >
                            {type === 'upcoming' ? 'Kommende' : 'Afsluttet'}
                        </Chip>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text variant="labelMedium" style={styles.infoLabel}>
                            Salon
                        </Text>
                        <Text variant="bodyMedium" style={styles.infoValue}>
                            {booking.SalonID ?? '—'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text variant="labelMedium" style={styles.infoLabel}>
                            Tid
                        </Text>
                        <Text variant="bodyMedium" style={styles.infoValue}>
                            {formatDate(booking.BestillingDato)}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        );
    }

    function renderSection(
        title: string,
        count: number,
        items: Booking[],
        type: 'upcoming' | 'completed',
        emptyText: string
    ) {
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        {title}
                    </Text>
                    <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                        {count}
                    </Chip>
                </View>

                {items.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={styles.emptyText}>
                                {emptyText}
                            </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    items.map((booking) => renderBookingCard(booking, type))
                )}
            </View>
        );
    }

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
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => void loadBookings(true)}
                        tintColor="#be185d"
                    />
                }
            >
                <Card style={styles.heroCard}>
                    <Card.Content style={styles.heroContent}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Dashboard
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Hej {user?.name || user?.username || 'igen'} — her er dine kommende og
                            afsluttede bookinger.
                        </Text>

                        <View style={styles.summaryRow}>
                            <View style={styles.summaryBox}>
                                <Text variant="labelMedium" style={styles.summaryLabel}>
                                    Kommende
                                </Text>
                                <Text variant="headlineSmall" style={styles.summaryValue}>
                                    {upcomingBookings.length}
                                </Text>
                            </View>

                            <View style={styles.summaryBox}>
                                <Text variant="labelMedium" style={styles.summaryLabel}>
                                    Afsluttede
                                </Text>
                                <Text variant="headlineSmall" style={styles.summaryValue}>
                                    {completedBookings.length}
                                </Text>
                            </View>
                        </View>

                        <Text variant="bodySmall" style={styles.statusText}>
                            {statusText}
                        </Text>
                    </Card.Content>
                </Card>

                {isLoading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator animating size="large" color="#be185d" />
                        <Text variant="bodyMedium" style={styles.loadingText}>
                            Henter bookinger...
                        </Text>
                    </View>
                ) : (
                    <>
                        {renderSection(
                            'Kommende bookinger',
                            upcomingBookings.length,
                            upcomingBookings,
                            'upcoming',
                            'Ingen kommende bookinger.'
                        )}

                        {renderSection(
                            'Afsluttede bookinger',
                            completedBookings.length,
                            completedBookings,
                            'completed',
                            'Ingen afsluttede bookinger.'
                        )}
                    </>
                )}
            </ScrollView>

            <Snackbar
                visible={!!message}
                onDismiss={() => setMessage(null)}
                duration={3500}
                style={styles.errorSnackbar}
            >
                {message?.text ?? ''}
            </Snackbar>
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