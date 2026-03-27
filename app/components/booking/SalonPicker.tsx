import {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Chip, Text} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {useSalon} from '@/context/SalonContext';
import {type Salon} from '@/api/Salon';

type SalonPickerProps = {
    onSelectSalon: (salon: Salon) => void;
};

export function SalonPicker({onSelectSalon}: SalonPickerProps) {
    const {salons} = useSalon();
    const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [userPostalCode, setUserPostalCode] = useState<string | null>(null);
    const [sortedSalons, setSortedSalons] = useState<Salon[]>(salons);

    const salonCountLabel = useMemo(() => {
        const count = salons.length;
        return `${count} salon${count === 1 ? '' : 'er'}`;
    }, [salons.length]);

    useEffect(() => {
        async function requestLocationAndSet() {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setUserLocation(null);
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            try {
                const reverse = await Location.reverseGeocodeAsync({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                const postalCode = reverse[0]?.postalCode?.trim();
                setUserPostalCode(postalCode || null);
            } catch {
                setUserPostalCode(null);
            }
        }

        void requestLocationAndSet();
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function sortSalonsByDistance() {
            if (!userLocation) {
                setSortedSalons(salons);
                return;
            }

            const salonsWithDistance = await Promise.all(
                salons.map(async (salon, index) => {
                    const searchText = `${salon.address}, ${salon.city}`.trim();
                    const postalMatchRank =
                        userPostalCode && containsPostalCode(searchText, userPostalCode) ? 0 : 1;

                    try {
                        const distance = await findBestDistanceForSalon(
                            salon,
                            userLocation.latitude,
                            userLocation.longitude
                        );
                        return {salon, postalMatchRank, distance, index};
                    } catch {
                        return {salon, postalMatchRank, distance: Number.POSITIVE_INFINITY, index};
                    }
                })
            );

            salonsWithDistance.sort((a, b) => {
                if (a.postalMatchRank !== b.postalMatchRank) {
                    return a.postalMatchRank - b.postalMatchRank;
                }
                if (a.distance === b.distance) return a.index - b.index;
                return a.distance - b.distance;
            });

            if (isMounted) {
                setSortedSalons(salonsWithDistance.map((item) => item.salon));
            }
        }

        void sortSalonsByDistance();

        return () => {
            isMounted = false;
        };
    }, [salons, userLocation, userPostalCode]);

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
                        Vælg salon
                    </Text>
                    <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                        {salonCountLabel}
                    </Chip>
                </View>

                {salons.length === 0 ? (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                Ingen saloner er oprettet endnu.
                            </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <View style={styles.list}>
                        {sortedSalons.map((salon) => {
                            const location = `${salon.address}, ${salon.city}`;

                            return (
                                <Card key={salon.id} style={styles.card}>
                                    <Card.Content style={styles.cardContent}>
                                        <Text variant="titleLarge" style={styles.cardTitle}>
                                            {salon.name}
                                        </Text>
                                        <Text variant="bodyMedium" style={styles.cardLocation}>
                                            {location}
                                        </Text>
                                        <Text variant="bodyMedium" style={styles.cardDescription}>
                                            {salon.phone} · {salon.email}
                                        </Text>

                                        <Button
                                            mode="contained"
                                            onPress={() => onSelectSalon(salon)}
                                            style={styles.selectButton}
                                            buttonColor="#be185d"
                                            textColor="#ffffff"
                                        >
                                            Vælg salon
                                        </Button>
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

function calculateDistanceInKm(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const dLat = toRad(toLat - fromLat);
    const dLon = toRad(toLon - fromLon);
    const lat1 = toRad(fromLat);
    const lat2 = toRad(toLat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

async function findBestDistanceForSalon(
    salon: Salon,
    userLat: number,
    userLon: number
): Promise<number> {
    const queries = [
        `${salon.address}, ${salon.city}, Danmark`,
        `${salon.address}, Danmark`,
        `${salon.city}, Danmark`,
    ];

    let bestDistance = Number.POSITIVE_INFINITY;

    for (const query of queries) {
        const results = await Location.geocodeAsync(query);
        for (const result of results) {
            const distance = calculateDistanceInKm(userLat, userLon, result.latitude, result.longitude);
            if (distance < bestDistance) {
                bestDistance = distance;
            }
        }
    }

    return bestDistance;
}

function containsPostalCode(text: string, postalCode: string): boolean {
    return text.toLowerCase().includes(postalCode.toLowerCase());
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
    selectButton: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    messageCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
    },
    messageText: {
        color: '#52525b',
    },
    errorContent: {
        gap: 10,
    },
    errorTitle: {
        color: '#b91c1c',
        fontWeight: '700',
    },
    retryButton: {
        alignSelf: 'flex-start',
    },
});
