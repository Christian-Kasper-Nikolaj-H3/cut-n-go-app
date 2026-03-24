import {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Chip, Text} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {getEmployeesBySalonId, type Employee} from '@/api/Employee';

type EmployeePickerProps = {
    salonId: number;
    salonName?: string;
    onBack: () => void;
    onSelectEmployee: (employee: Employee) => void;
};

export function EmployeePicker({salonId, salonName, onBack, onSelectEmployee}: EmployeePickerProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEmployees = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getEmployeesBySalonId(salonId);
            setEmployees(response.data.employees ?? []);
        } catch (err) {
            setEmployees([]);
            setError(err instanceof Error ? err.message : 'Kunne ikke hente medarbejdere');
        } finally {
            setIsLoading(false);
        }
    }, [salonId]);

    useEffect(() => {
        void loadEmployees();
    }, [loadEmployees]);

    const employeeCountLabel = useMemo(() => {
        const count = employees.length;
        return `${count} medarbejder${count === 1 ? '' : 'e'}`;
    }, [employees.length]);

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
                    <View style={styles.headerText}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Vælg medarbejder
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            {salonName ? `Salon: ${salonName}` : 'Vælg en medarbejder til din booking'}
                        </Text>
                    </View>

                    <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                        {employeeCountLabel}
                    </Chip>
                </View>

                <Button mode="text" onPress={onBack} style={styles.backButton}>
                    Tilbage
                </Button>

                {isLoading ? (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                Henter medarbejdere...
                            </Text>
                        </Card.Content>
                    </Card>
                ) : error ? (
                    <Card style={styles.messageCard}>
                        <Card.Content style={styles.errorContent}>
                            <Text variant="titleMedium" style={styles.errorTitle}>
                                Noget gik galt
                            </Text>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                {error}
                            </Text>
                            <Button mode="contained" onPress={() => void loadEmployees()} style={styles.retryButton}>
                                Prøv igen
                            </Button>
                        </Card.Content>
                    </Card>
                ) : employees.length === 0 ? (
                    <Card style={styles.messageCard}>
                        <Card.Content>
                            <Text variant="bodyMedium" style={styles.messageText}>
                                Ingen medarbejdere er knyttet til denne salon endnu.
                            </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <View style={styles.list}>
                        {employees.map((employee) => {
                            const info = employee.user.information;
                            const displayName = `${info.first_name} ${info.last_name}`.trim();
                            const contactLine = `${info.phone} · ${info.email}`;

                            return (
                                <Card key={employee.id} style={styles.card}>
                                    <Card.Content style={styles.cardContent}>
                                        <Text variant="titleLarge" style={styles.cardTitle}>
                                            {displayName}
                                        </Text>

                                        <Text variant="bodyMedium" style={styles.cardInfo}>
                                            @{employee.user.username}
                                        </Text>

                                        <Text variant="bodyMedium" style={styles.cardInfo}>
                                            {contactLine}
                                        </Text>

                                        <Button
                                            mode="contained"
                                            onPress={() => onSelectEmployee(employee)}
                                            style={styles.selectButton}
                                            buttonColor="#be185d"
                                            textColor="#ffffff"
                                        >
                                            Vælg medarbejder
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
    headerText: {
        flex: 1,
        gap: 4,
    },
    title: {
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
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -8,
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
    cardInfo: {
        color: '#52525b',
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