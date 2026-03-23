import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { AppSnackbar } from '@/components/common/AppSnackbar';
import { getMyBookings, type Booking } from '@/api/Booking';
import { BookingSection } from '@/components/dashboard/BookingSection';

export type BookingStatus = 'upcoming' | 'completed';

export type DashboardBooking = {
    key: string;
    id?: number | string;
    salon_id?: string;
    date?: string;
    dateValue: number;
};

type MessageState = {
    type: 'error' | 'success';
    text: string;
} | null;

const DASHBOARD_GRADIENT = ['#ffeef8', '#fff0f5', '#ffe6f0'] as const;
const ERROR_TEXT = 'Der opstod en fejl ved hentning af bookinger.';
const UNKNOWN_TEXT = 'Ukendt dato';

function isValidDate(value?: string): value is string {
    if (!value) {
        return false;
    }

    const date = new Date(value);
    return !Number.isNaN(date.getTime());
}

function formatBookingDate(value?: string) {
    if (!isValidDate(value)) {
        return UNKNOWN_TEXT;
    }

    return new Date(value).toLocaleString('da-DK', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

function toDashboardBooking(booking: Booking, index: number): DashboardBooking | null {
    if (!isValidDate(booking.date)) {
        return null;
    }

    return {
        ...booking,
        key: `${booking.id ?? 'booking'}-${booking.date}-${index}`,
        dateValue: new Date(booking.date).getTime(),
    };
}

function sortBookings(bookings: Booking[]) {
    const now = Date.now();

    return bookings
        .map(toDashboardBooking)
        .filter((booking): booking is DashboardBooking => booking !== null)
        .reduce(
            (acc, booking) => {
                if (booking.dateValue > now) {
                    acc.upcoming.push(booking);
                } else {
                    acc.completed.push(booking);
                }
                return acc;
            },
            { upcoming: [] as DashboardBooking[], completed: [] as DashboardBooking[] }
        );
}

export default function DashboardScreen() {
    const { token } = useAuth();
    const { user } = useUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [message, setMessage] = useState<MessageState>(null);

    const loadBookings = useCallback(
        async (refresh = false) => {
            if (!token) {
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
                const response = await getMyBookings();
                setBookings(response.data.bookings ?? []);
            } catch (error) {
                setBookings([]);
                setMessage({
                    type: 'error',
                    text: error instanceof Error ? error.message : ERROR_TEXT,
                });
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [token]
    );

    useFocusEffect(
        useCallback(() => {
            void loadBookings();
        }, [loadBookings])
    );

    const { upcoming, completed } = useMemo(() => sortBookings(bookings), [bookings]);

    const statusText = useMemo(() => {
        if (isLoading) {
            return 'Henter bookinger...';
        }

        if (bookings.length === 0) {
            return 'Du har ingen bookinger endnu.';
        }

        return `Du har ${upcoming.length} kommende og ${completed.length} afsluttede bookinger.`;
    }, [bookings.length, completed.length, isLoading, upcoming.length]);

    return (
        <LinearGradient
            colors={DASHBOARD_GRADIENT}
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
                        <BookingSection
                            title="Kommende bookinger"
                            count={upcoming.length}
                            bookings={upcoming}
                            status="upcoming"
                            emptyText="Ingen kommende bookinger."
                            formatDate={formatBookingDate}
                        />
                        <BookingSection
                            title="Afsluttede bookinger"
                            count={completed.length}
                            bookings={completed}
                            status="completed"
                            emptyText="Ingen afsluttede bookinger."
                            formatDate={formatBookingDate}
                        />
                    </>
                )}
            </ScrollView>

            <AppSnackbar
                visible={!!message}
                message={message?.text ?? ''}
                type={message?.type ?? 'info'}
                onDismiss={() => setMessage(null)}
                duration={3500}
            />
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