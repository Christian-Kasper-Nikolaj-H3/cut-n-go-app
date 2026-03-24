import {useEffect, useState} from 'react';
import {ActivityIndicator, Chip, HelperText, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {getAvailableTimes} from "@/api/Booking";

type TimePickerSectionProps = {
    selectedSalon: string;
    selectedEmployee: string;
    selectedDate: Date | null;
    selectedTime: string;
    onSelectTime: (time: string) => void;
    onChange?: () => void;
};

export function TimePickerSection({
    selectedSalon,
    selectedEmployee,
    selectedDate,
    selectedTime,
    onSelectTime,
    onChange,
}: TimePickerSectionProps) {
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedSalon || !selectedEmployee || !selectedDate) {
            setAvailableTimes([]);
            return;
        }

        const loadAvailableTimes = async () => {
            setIsLoadingTimes(true);
            setError(null);

            try {
                const response = await getAvailableTimes({
                    salon_id: selectedSalon,
                    employee_id: selectedEmployee,
                    date: selectedDate.toLocaleDateString('da-DK'),
                });

                // @ts-ignore
                setAvailableTimes(response.data.availableTimes ?? []);
            } catch (err) {
                setAvailableTimes([]);
                setError(err instanceof Error ? err.message : 'Kunne ikke hente ledige tider');
            } finally {
                setIsLoadingTimes(false);
            }
        };

        void loadAvailableTimes();
    }, [selectedSalon, selectedEmployee, selectedDate]);

    return (
        <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
                Tidspunkt *
            </Text>

            {!selectedSalon || !selectedEmployee || !selectedDate ? (
                <HelperText type="info" visible style={styles.helperText}>
                    Vælg først salon, medarbejder og dato.
                </HelperText>
            ) : isLoadingTimes ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating size="small" color="#be185d" />
                    <Text variant="bodyMedium" style={styles.loadingText}>
                        Henter ledige tider...
                    </Text>
                </View>
            ) : error ? (
                <HelperText type="error" visible style={styles.helperText}>
                    {error}
                </HelperText>
            ) : availableTimes.length === 0 ? (
                <HelperText type="error" visible style={styles.helperText}>
                    Ingen ledige tider for den valgte dato.
                </HelperText>
            ) : (
                <View style={styles.timeGrid}>
                    {availableTimes.map((timeValue) => (
                        <Chip
                            key={timeValue}
                            selected={selectedTime === timeValue}
                            onPress={() => {
                                onSelectTime(timeValue);
                                onChange?.();
                            }}
                            mode="outlined"
                            style={[
                                styles.timeChip,
                                selectedTime === timeValue && styles.timeChipSelected,
                            ]}
                            textStyle={[
                                styles.timeChipText,
                                selectedTime === timeValue && styles.timeChipTextSelected,
                            ]}
                            selectedColor="#ffffff"
                        >
                            {timeValue}
                        </Chip>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 8,
    },
    sectionTitle: {
        color: '#9d174d',
        fontWeight: '700',
    },
    helperText: {
        marginTop: 0,
        paddingHorizontal: 0,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
    },
    loadingText: {
        color: '#71717a',
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingTop: 4,
    },
    timeChip: {
        backgroundColor: '#fffafc',
        borderColor: '#f5c2d7',
    },
    timeChipSelected: {
        backgroundColor: '#ec4899',
        borderColor: '#ec4899',
    },
    timeChipText: {
        color: '#9d174d',
        fontWeight: '600',
    },
    timeChipTextSelected: {
        color: '#ffffff',
    },
});