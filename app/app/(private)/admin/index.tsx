import {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {Button, Card, Text} from 'react-native-paper';
import {useSalon} from '@/context/SalonContext';
import {useEmployee} from '@/context/EmployeeContext';
import {useTreatment} from '@/context/TreatmentContext';

export default function AdminIndexScreen() {
    const router = useRouter();
    const {salons} = useSalon();
    const {employees} = useEmployee();
    const {treatments, categories} = useTreatment();

    const stats = useMemo(
        () => [
            {label: 'Saloner', value: salons.length},
            {label: 'Medarbejdere', value: employees.length},
            {label: 'Behandlinger', value: treatments.length},
            {label: 'Kategorier', value: categories.length},
        ],
        [salons.length, employees.length, treatments.length, categories.length]
    );

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
                    <Card.Title title="Admin oversigt"/>
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Hurtigt overblik over data i systemet.
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.statsGrid}>
                    {stats.map((item) => (
                        <Card key={item.label} style={styles.statCard}>
                            <Card.Content>
                                <Text variant="labelLarge" style={styles.statLabel}>{item.label}</Text>
                                <Text variant="headlineMedium" style={styles.statValue}>{item.value}</Text>
                            </Card.Content>
                        </Card>
                    ))}
                </View>

                <Card style={styles.card}>
                    <Card.Title title="Hurtige handlinger"/>
                    <Card.Content style={styles.actions}>
                        <Button mode="contained" icon="store" onPress={() => router.push('/(private)/admin/salons')}>
                            Gå til saloner
                        </Button>
                        <Button mode="contained" icon="account-group" onPress={() => router.push('/(private)/admin/employees')}>
                            Gå til medarbejdere
                        </Button>
                        <Button mode="contained" icon="content-cut" onPress={() => router.push('/(private)/admin/treatments')}>
                            Gå til behandlinger
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 12,
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
    subtitle: {
        color: '#52525b',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
    },
    statLabel: {
        color: '#9d174d',
        fontWeight: '700',
    },
    statValue: {
        marginTop: 6,
        color: '#be185d',
        fontWeight: '800',
    },
    actions: {
        gap: 10,
    },
});
