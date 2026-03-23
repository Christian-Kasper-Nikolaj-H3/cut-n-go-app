import { View, StyleSheet } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { BookingCard } from '@/components/dashboard/BookingCard';
import type { BookingStatus, DashboardBooking } from '@/app/(private)/dashboard';

export type BookingSectionProps = {
    title: string;
    count: number;
    bookings: DashboardBooking[];
    emptyText: string;
    status: BookingStatus;
    formatDate: (value?: string) => string;
};

export function BookingSection({
                                   title,
                                   count,
                                   bookings,
                                   emptyText,
                                   status,
                                   formatDate,
                               }: BookingSectionProps) {
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

            {bookings.length === 0 ? (
                <Card style={styles.emptyCard}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            {emptyText}
                        </Text>
                    </Card.Content>
                </Card>
            ) : (
                bookings.map((booking) => (
                    <BookingCard
                        key={booking.key}
                        booking={booking}
                        status={status}
                        formatDate={formatDate}
                    />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});