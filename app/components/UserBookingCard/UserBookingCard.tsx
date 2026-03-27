import { Linking, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Text } from 'react-native-paper';
import { type Booking } from '@/api/User';

export function UserBookingCard({
    booking,
    status
} : {
    booking: Booking;
    status: 'upcoming' | 'completed';
}) {

    const formatBookingDate = (value: string) => new Date(value).toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short'});
    const destination = `${booking.salon.address}, ${booking.salon.city}`.trim();
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

    async function handleOpenDirections() {
        await Linking.openURL(directionsUrl);
    }

    return (
        <Card style={styles.bookingCard}>
            <Card.Content style={styles.bookingCardContent}>
                <View style={styles.bookingCardHeader}>
                    <Text variant="titleMedium" style={styles.bookingTitle}>
                        Ordre #{booking.id}
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
                        {booking.salon.name}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text variant="labelMedium" style={styles.infoLabel}>
                        Tid
                    </Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                        {formatBookingDate(booking.date)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text variant="labelMedium" style={styles.infoLabel}>
                        Adresse
                    </Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                        {destination}
                    </Text>
                </View>

                <View style={styles.routeBox}>
                    <Text variant="bodySmall" style={styles.routeHelpText}>
                        Tryk for rutevejledning til salonen.
                    </Text>
                    <Button
                        mode="contained"
                        compact
                        icon="map-marker-path"
                        onPress={handleOpenDirections}
                        contentStyle={styles.routeButtonContent}
                        labelStyle={styles.routeButtonLabel}
                        style={styles.routeButton}
                    >
                        Åbn rute i kort
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    bookingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fce7f3',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    bookingCardContent: {
        padding: 16,
        gap: 12,
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
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
    },
    infoLabel: {
        color: '#9d174d',
        fontWeight: '700',
        minWidth: 68,
    },
    infoValue: {
        color: '#3f3f46',
        flex: 1,
        textAlign: 'right',
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
    routeBox: {
        marginTop: 2,
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#fff7fb',
    },
    routeHelpText: {
        color: '#71717a',
        marginBottom: 6,
    },
    routeButtonContent: {
        justifyContent: 'center',
    },
    routeButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#be185d',
    },
    routeButtonLabel: {
        color: '#ffffff',
        fontWeight: '700',
    },
});
