import {useMemo, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Button, Card, Chip, Text} from 'react-native-paper';
import {useEmployeePortal} from '@/context/EmployeePortalContext';

type BookingTab = 'upcoming' | 'completed';

export default function EmployeeScreen() {
    const {employee, bookings, completeBooking} = useEmployeePortal();
    const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
    const [completingBookingId, setCompletingBookingId] = useState<number | null>(null);

    const formatBookingDateTime = (value: string) =>
        new Intl.DateTimeFormat('da-DK', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));

    const employeeName = useMemo(() => {
        if (!employee?.user?.information) return '-';
        const {first_name, last_name} = employee.user.information;
        return `${first_name ?? ''} ${last_name ?? ''}`.trim() || '-';
    }, [employee]);

    const stats = useMemo(() => {
        let upcoming = 0;
        let completed = 0;
        let totalEarnings = 0;

        for (const booking of bookings) {
            if (booking.completed_at) {
                completed += 1;
            } else {
                upcoming += 1;
            }

            if (booking.completed_at && Array.isArray(booking.treatments)) {
                for (const treatment of booking.treatments) {
                    const price = Number(treatment.price);
                    if (!Number.isNaN(price)) {
                        totalEarnings += price;
                    }
                }
            }
        }

        return {
            total: bookings.length,
            upcoming,
            completed,
            totalEarnings,
        };
    }, [bookings]);

    const filteredBookings = useMemo(() => {
        const now = new Date();
        return bookings.filter((booking) => {
            const isCompleted = !!booking.completed_at;
            if (activeTab === 'completed') return isCompleted;
            return !isCompleted && new Date(booking.date) >= now;
        });
    }, [bookings, activeTab]);

    const formattedTotalEarnings = useMemo(() => `${stats.totalEarnings.toFixed(2)} kr`, [stats.totalEarnings]);

    async function handleCompleteBooking(bookingId: number) {
        if (completingBookingId !== null) return;
        try {
            setCompletingBookingId(bookingId);
            await completeBooking(bookingId);
        } finally {
            setCompletingBookingId(null);
        }
    }

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Card style={styles.card}>
                    <Card.Content style={styles.profileContent}>
                        <View style={styles.profileTop}>
                            <Text variant="titleMedium" style={styles.profileTitle}>Medarbejder</Text>
                            <Text variant="headlineSmall" style={styles.profileName}>{employeeName}</Text>
                        </View>

                        <View style={styles.profileDivider} />

                        <View style={styles.detailList}>
                            <View style={styles.detailRow}>
                                <Text variant="bodyMedium" style={styles.detailLabel}>Brugernavn</Text>
                                <Text variant="bodyMedium" style={styles.detailValue}>{employee?.user?.username ?? '-'}</Text>
                            </View>
                            <View style={styles.rowDivider} />
                            <View style={styles.detailRow}>
                                <Text variant="bodyMedium" style={styles.detailLabel}>Rolle</Text>
                                <Text variant="bodyMedium" style={styles.detailValue}>{employee?.role?.name ?? '-'}</Text>
                            </View>
                            <View style={styles.rowDivider} />
                            <View style={styles.detailRow}>
                                <Text variant="bodyMedium" style={styles.detailLabel}>Salon</Text>
                                <Text variant="bodyMedium" style={styles.detailValue}>{employee?.salon?.name ?? '-'}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <View style={styles.kpiCardsRow}>
                    <Card style={styles.kpiCard}>
                        <Card.Content style={styles.kpiCardContent}>
                            <Text variant="labelMedium" style={styles.kpiCardLabel}>Kommende</Text>
                            <Text variant="titleLarge" style={styles.kpiCardValue}>{stats.upcoming}</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.kpiCard}>
                        <Card.Content style={styles.kpiCardContent}>
                            <Text variant="labelMedium" style={styles.kpiCardLabel}>Afsluttede</Text>
                            <Text variant="titleLarge" style={styles.kpiCardValue}>{stats.completed}</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.kpiCardWide}>
                        <Card.Content style={styles.kpiCardContent}>
                            <Text variant="labelMedium" style={styles.kpiCardLabel}>Indtjening i alt</Text>
                            <Text variant="titleLarge" style={styles.kpiCardValue}>{formattedTotalEarnings}</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Card style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>
                            Mine bookinger
                        </Text>
                        <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                            {filteredBookings.length}
                        </Chip>
                    </View>
                    <Card.Content style={styles.tabActions}>
                        <Button
                            mode={activeTab === 'upcoming' ? 'contained' : 'outlined'}
                            onPress={() => setActiveTab('upcoming')}
                            style={styles.tabButton}
                        >
                            Kommende
                        </Button>
                        <Button
                            mode={activeTab === 'completed' ? 'contained' : 'outlined'}
                            onPress={() => setActiveTab('completed')}
                            style={styles.tabButton}
                        >
                            Afsluttede
                        </Button>
                    </Card.Content>
                    <Card.Content>
                        <FlatList
                            data={filteredBookings}
                            keyExtractor={(item) => String(item.id)}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.separator}/>}
                            renderItem={({item}) => (
                                <View style={styles.row}>
                                    <View style={styles.rowInfo}>
                                        <View style={styles.bookingRow}>
                                            <Text variant="bodySmall" style={styles.bookingLabel}>Tidspunkt</Text>
                                            <Text variant="bodyMedium" style={styles.bookingValue}>
                                                {formatBookingDateTime(item.date)}
                                            </Text>
                                        </View>
                                        <View style={styles.bookingRow}>
                                            <Text variant="bodySmall" style={styles.bookingLabel}>Kunde</Text>
                                            <Text variant="bodyMedium" style={styles.bookingValue}>
                                                {[
                                                    item.information?.first_name,
                                                    item.information?.last_name
                                                ].filter(Boolean).join(' ').trim() ||
                                                    [
                                                        item.information?.user?.information?.first_name,
                                                        item.information?.user?.information?.last_name
                                                    ].filter(Boolean).join(' ').trim() ||
                                                    '-'}
                                            </Text>
                                        </View>
                                        <View style={styles.bookingRow}>
                                            <Text variant="bodySmall" style={styles.bookingLabel}>Salon</Text>
                                            <Text variant="bodyMedium" style={styles.bookingValue}>
                                                {item.salon?.name ?? employee?.salon?.name ?? 'Salon'}
                                            </Text>
                                        </View>
                                        <View style={styles.bookingRow}>
                                            <Text variant="bodySmall" style={styles.bookingLabel}>Behandlinger</Text>
                                            <Text variant="bodyMedium" style={styles.bookingValue}>
                                                {Array.isArray(item.treatments) && item.treatments.length > 0
                                                    ? item.treatments.map((treatment) => treatment.name).join(', ')
                                                    : 'Ingen valgt'}
                                            </Text>
                                        </View>
                                        <View style={styles.bookingRow}>
                                            <Text variant="bodySmall" style={styles.bookingLabel}>Beløb</Text>
                                            <Text variant="bodyMedium" style={styles.rowAmount}>
                                                {Array.isArray(item.treatments)
                                                    ? `${item.treatments.reduce((sum, treatment) => sum + (Number(treatment.price) || 0), 0).toFixed(2)} kr`
                                                    : '0.00 kr'}
                                            </Text>
                                        </View>
                                        {activeTab === 'upcoming' ? (
                                            <View style={styles.completeButtonRow}>
                                                <Button
                                                    mode="contained"
                                                    compact
                                                    loading={completingBookingId === item.id}
                                                    disabled={completingBookingId !== null}
                                                    onPress={() => handleCompleteBooking(item.id)}
                                                >
                                                    Marker som afsluttet
                                                </Button>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text variant="bodyMedium" style={styles.emptyText}>
                                    {activeTab === 'upcoming' ? 'Ingen kommende bookinger.' : 'Ingen afsluttede bookinger.'}
                                </Text>
                            }
                        />
                    </Card.Content>
                </Card>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    content: {padding: 20, paddingBottom: 30, gap: 18},
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    profileContent: {gap: 12, paddingTop: 6},
    profileTop: {
        gap: 3,
    },
    profileTitle: {
        color: '#a1a1aa',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.7,
    },
    profileName: {
        color: '#be185d',
        fontWeight: '800',
    },
    profileDivider: {
        height: 1,
        backgroundColor: '#fce7f3',
    },
    detailList: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    detailLabel: {
        color: '#71717a',
        fontWeight: '600',
    },
    detailValue: {
        color: '#27272a',
        fontWeight: '700',
        textAlign: 'right',
        flexShrink: 1,
    },
    rowDivider: {
        height: 1,
        backgroundColor: '#fce7f3',
    },
    kpiCardsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    kpiCard: {
        width: '48.5%',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    kpiCardWide: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        marginTop: 10,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    kpiCardContent: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    kpiCardLabel: {
        color: '#9d174d',
        fontWeight: '700',
        opacity: 0.8,
    },
    kpiCardValue: {
        color: '#be185d',
        fontWeight: '800',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 6,
    },
    sectionTitle: {color: '#9d174d', fontWeight: '700', flex: 1},
    tabActions: {
        flexDirection: 'row',
        gap: 8,
        paddingTop: 0,
    },
    tabButton: {
        flex: 1,
    },
    countChip: {backgroundColor: '#fdf2f8', borderColor: '#f5c2d7'},
    countChipText: {color: '#be185d', fontWeight: '700'},
    separator: {height: 1, backgroundColor: '#fce7f3'},
    row: {paddingVertical: 8},
    rowInfo: {flex: 1},
    bookingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 2,
    },
    bookingLabel: {
        color: '#71717a',
        fontWeight: '600',
        minWidth: 90,
    },
    bookingValue: {
        color: '#3f3f46',
        textAlign: 'right',
        flex: 1,
    },
    rowAmount: {color: '#27272a', fontWeight: '700'},
    completeButtonRow: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    emptyText: {textAlign: 'center', color: '#71717a', paddingVertical: 8},
});
