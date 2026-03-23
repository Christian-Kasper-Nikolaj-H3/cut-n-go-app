import {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Chip, Text} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {getAllSalons, type Salon} from '@/api/Salon';

export function SalonPickerScreen() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSalons = useCallback(async (refresh = false) => {
        if (refresh) {
            setIsLoading(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await getAllSalons();
            setSalons(response.data.salons ?? []);
        } catch (err) {
            setSalons([]);
            setError(err instanceof Error ? err.message : 'Kunne ikke hente saloner');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSalons();
    }, [loadSalons]);

    const salonCountLabel = useMemo(() => {
        const count = salons.length;
        return `${count} salon${count === 1 ? '' : 'er'}`;
    }, [salons.length]);

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Salonoversigt
                    </Text>
                    <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                        {salonCountLabel}
                    </Chip>
                </View>

                {isLoading ? (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                Henter saloner...
                            </Text>
                        </Card.Content>
                    </Card>
                ) : error ? (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.errorTitle}>
                                Noget gik galt
                            </Text>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                {error}
                            </Text>
                        </Card.Content>
                    </Card>
                ) : salons.length === 0 ? (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                Ingen saloner er oprettet endnu.
                            </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <View style={styles.list}>
                        {salons.map((salon) => {
                            const location = `${salon.address}, ${salon.city}`;
                            const description = `${salon.name} ligger centralt i ${salon.city} og er klar til at tage imod kunder.`;

                            return (
                                <Card key={salon.id ?? `${salon.name}-${salon.email}`} style={styles.card}>
                                    <Card.Content style={styles.cardContent}>
                                        <Text variant="titleLarge" style={styles.cardTitle}>
                                            {salon.name}
                                        </Text>
                                        <Text variant="bodyMedium" style={styles.cardLocation}>
                                            {location}
                                        </Text>
                                        <Text variant="bodyMedium" style={styles.cardDescription}>
                                            {description}
                                        </Text>
                                    </Card.Content>
                                </Card>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 30,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingTop: 8,
    },
    title: {
        flex: 1,
        color: '#9d174d',
        fontWeight: '800',
    },
    subtitle: {
        color: '#6b7280',
    },
    countChip: {
        backgroundColor: '#fdf2f8',
        borderColor: '#f5c2d7',
    },
    countChipText: {
        color: '#be185d',
        fontWeight: '700',
    },
    list: {
        gap: 14,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: {
        gap: 6,
    },
    cardTitle: {
        color: '#be185d',
        fontWeight: '700',
    },
    cardLocation: {
        color: '#7c3aed',
        fontWeight: '600',
    },
    cardDescription: {
        color: '#52525b',
        lineHeight: 20,
    },
    messageCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
    },
    messageText: {
        color: '#52525b',
    },
    errorTitle: {
        color: '#b91c1c',
        fontWeight: '700',
        marginBottom: 4,
    },
});