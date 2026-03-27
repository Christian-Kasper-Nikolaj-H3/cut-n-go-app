import {useEffect, useMemo, useState} from 'react';
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

const ALL_TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
];

function isTimeInFuture(selectedDate: Date, time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate.getTime() > Date.now();
}
function formatLocalDateNoTime(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

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
            setError(null);
            return;
        }

        const loadAvailableTimes = async () => {
            setIsLoadingTimes(true);
            setError(null);

            try {
                const response = await getAvailableTimes({
                    salon_id: selectedSalon,
                    employee_id: selectedEmployee,
                    date: formatLocalDateNoTime(selectedDate)
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

    const slotState = useMemo(() => {
        return ALL_TIME_SLOTS.map((time) => {
            const isAvailableFromApi = availableTimes.includes(time);
            const isNotInPast = selectedDate ? isTimeInFuture(selectedDate, time) : false;

            return {
                time,
                enabled: isAvailableFromApi && isNotInPast,
            };
        });
    }, [availableTimes, selectedDate]);

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
                    {slotState.map((slot) => (
                        <Chip
                            key={slot.time}
                            selected={selectedTime === slot.time}
                            disabled={!slot.enabled}
                            onPress={() => {
                                if (!slot.enabled) return;
                                onSelectTime(slot.time);
                                onChange?.();
                            }}
                            mode="outlined"
                            style={[
                                styles.timeChip,
                                !slot.enabled && styles.timeChipDisabled,
                                selectedTime === slot.time && styles.timeChipSelected,
                            ]}
                            textStyle={[
                                styles.timeChipText,
                                !slot.enabled && styles.timeChipTextDisabled,
                                selectedTime === slot.time && styles.timeChipTextSelected,
                            ]}
                            selectedColor="#ffffff"
                        >
                            {slot.time}
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
    timeChipDisabled: {
        backgroundColor: '#f4f4f5',
        borderColor: '#e4e4e7',
        opacity: 0.55,
    },
    timeChipSelected: {
        backgroundColor: '#ec4899',
        borderColor: '#ec4899',
    },
    timeChipText: {
        color: '#9d174d',
        fontWeight: '600',
    },
    timeChipTextDisabled: {
        color: '#a1a1aa',
    },
    timeChipTextSelected: {
        color: '#ffffff',
    },
});