import { useEffect, useState } from 'react';
import { ActivityIndicator, Chip, HelperText, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { getAvailableBookingTimes } from '@/services/api';

type TimePickerSectionProps = {
    selectedSalon: string;
    selectedDate: Date | null;
    selectedTime: string;
    onSelectTime: (time: string) => void;
    onChange?: () => void;
};

export function TimePickerSection({
                                      selectedSalon,
                                      selectedDate,
                                      selectedTime,
                                      onSelectTime,
                                      onChange,
                                  }: TimePickerSectionProps) {
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);

    useEffect(() => {
        async function loadAvailableTimes() {
            if (!selectedSalon || !selectedDate) {
                setAvailableTimes([]);
                onSelectTime('');
                return;
            }

            setIsLoadingTimes(true);
            onSelectTime('');

            try {
                const formattedApiDate = selectedDate.toLocaleDateString('dk-DK');
                const data = await getAvailableBookingTimes(selectedSalon, formattedApiDate);

                if (Array.isArray(data.availableTimes)) {
                    setAvailableTimes(data.availableTimes);
                } else {
                    setAvailableTimes([]);
                }
            } catch {
                setAvailableTimes([]);
            } finally {
                setIsLoadingTimes(false);
            }
        }

        void loadAvailableTimes();
    }, [selectedSalon, selectedDate, onSelectTime]);

    return (
        <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
                Tidspunkt *
            </Text>

            {!selectedSalon || !selectedDate ? (
                <HelperText type="info" visible style={styles.helperText}>
                    Vælg først salon og dato.
                </HelperText>
            ) : isLoadingTimes ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating size="small" color="#be185d" />
                    <Text variant="bodyMedium" style={styles.loadingText}>
                        Henter ledige tider...
                    </Text>
                </View>
            ) : availableTimes.length === 0 ? (
                <HelperText type="error" visible style={styles.helperText}>
                    Ingen ledige tider for den valgte dato.
                </HelperText>
            ) : (
                <View style={styles.timeGrid}>
                    {availableTimes.map((time) => (
                        <Chip
                            key={time}
                            selected={selectedTime === time}
                            onPress={() => {
                                onSelectTime(time);
                                onChange?.();
                            }}
                            mode="outlined"
                            style={[
                                styles.timeChip,
                                selectedTime === time && styles.timeChipSelected,
                            ]}
                            textStyle={[
                                styles.timeChipText,
                                selectedTime === time && styles.timeChipTextSelected,
                            ]}
                            selectedColor="#ffffff"
                        >
                            {time}
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