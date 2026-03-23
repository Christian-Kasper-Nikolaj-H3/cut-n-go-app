import { View, StyleSheet } from 'react-native';
import { Card, Chip, Divider, Text } from 'react-native-paper';
import type { BookingStatus } from '@/app/(private)/dashboard';

export type BookingCardProps = {
    booking: {
        id?: number | string;
        salon_id?: string;
        date?: string;
    };
    status: BookingStatus;
    formatDate: (value?: string) => string;
};

export function BookingCard({ booking, status, formatDate }: BookingCardProps) {
    return (
        <Card style={styles.bookingCard}>
            <Card.Content style={styles.bookingCardContent}>
                <View style={styles.bookingCardHeader}>
                    <Text variant="titleMedium" style={styles.bookingTitle}>
                        Ordre #{booking.id ?? '—'}
                    </Text>

                    <Chip
                        compact
                        style={[
                            styles.statusChip,
                            status === 'upcoming'
                                ? styles.statusChipUpcoming
                                : styles.statusChipCompleted,
                        ]}
                        textStyle={styles.statusChipText}
                    >
                        {status === 'upcoming' ? 'Kommende' : 'Afsluttet'}
                    </Chip>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.infoRow}>
                    <Text variant="labelMedium" style={styles.infoLabel}>
                        Salon
                    </Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                        {booking.salon_id ?? '—'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text variant="labelMedium" style={styles.infoLabel}>
                        Tid
                    </Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                        {formatDate(booking.date)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    bookingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
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
});