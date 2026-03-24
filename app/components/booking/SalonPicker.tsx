import {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Chip, Text} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {useSalon} from '@/context/SalonContext';
import {type Salon} from '@/api/Salon';

type SalonPickerProps = {
    onSelectSalon: (salon: Salon) => void;
};

export function SalonPicker({onSelectSalon}: SalonPickerProps) {
    const {salons} = useSalon();

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
                        {salons.map((salon) => {
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