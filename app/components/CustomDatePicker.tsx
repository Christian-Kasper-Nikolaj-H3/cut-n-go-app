import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Portal, Modal, Text, IconButton } from 'react-native-paper';

type CustomDatePickerProps = {
    value: Date | null;
    onChange: (date: Date) => void;
    minimumDate?: Date;
};

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date | null, b: Date | null) {
    if (!a || !b) {
        return false;
    }

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getMonthLabel(date: Date) {
    return date.toLocaleDateString('da-DK', {
        month: 'long',
        year: 'numeric',
    });
}

function getCalendarCells(displayDate: Date) {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = getDaysInMonth(year, month);

    const jsDay = firstDayOfMonth.getDay();
    const mondayBasedOffset = jsDay === 0 ? 6 : jsDay - 1;

    const cells: Array<Date | null> = [];

    for (let i = 0; i < mondayBasedOffset; i += 1) {
        cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
        cells.push(null);
    }

    return cells;
}

export function CustomDatePicker({
                                     value,
                                     onChange,
                                     minimumDate = new Date(),
                                 }: CustomDatePickerProps) {
    const [visible, setVisible] = useState(false);
    const [displayDate, setDisplayDate] = useState(value ?? new Date());
    const [draftDate, setDraftDate] = useState<Date | null>(value ?? null);

    const minDate = useMemo(() => startOfDay(minimumDate), [minimumDate]);
    const cells = useMemo(() => getCalendarCells(displayDate), [displayDate]);

    function openPicker() {
        setDisplayDate(value ?? new Date());
        setDraftDate(value ?? null);
        setVisible(true);
    }

    function closePicker() {
        setVisible(false);
    }

    function goToPreviousMonth() {
        setDisplayDate(
            new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1)
        );
    }

    function goToNextMonth() {
        setDisplayDate(
            new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1)
        );
    }

    function handleSelectDate(date: Date) {
        if (startOfDay(date) < minDate) {
            return;
        }

        setDraftDate(date);
    }

    function handleConfirm() {
        if (draftDate) {
            onChange(draftDate);
        }
        closePicker();
    }

    const triggerLabel = value
        ? value.toLocaleDateString('da-DK', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : 'Vælg dato';

    return (
        <>
            <Button
                mode="outlined"
                icon="calendar"
                onPress={openPicker}
                style={styles.triggerButton}
                contentStyle={styles.triggerButtonContent}
                labelStyle={styles.triggerButtonLabel}
            >
                {triggerLabel}
            </Button>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closePicker}
                    contentContainerStyle={styles.modalContainer}
                >
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text variant="titleLarge" style={styles.headerTitle}>
                                Vælg dato
                            </Text>
                        </View>

                        <View style={styles.monthRow}>
                            <IconButton
                                icon="chevron-left"
                                iconColor="#9d174d"
                                onPress={goToPreviousMonth}
                            />
                            <Text variant="titleMedium" style={styles.monthLabel}>
                                {getMonthLabel(displayDate)}
                            </Text>
                            <IconButton
                                icon="chevron-right"
                                iconColor="#9d174d"
                                onPress={goToNextMonth}
                            />
                        </View>

                        <View style={styles.weekdaysRow}>
                            {WEEKDAYS.map((weekday) => (
                                <Text key={weekday} style={styles.weekdayText}>
                                    {weekday}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.grid}>
                            {cells.map((date, index) => {
                                if (!date) {
                                    return <View key={`empty-${index}`} style={styles.dayCell} />;
                                }

                                const isDisabled = startOfDay(date) < minDate;
                                const isSelected = isSameDay(date, draftDate);
                                const isToday = isSameDay(date, new Date());

                                return (
                                    <Button
                                        key={date.toISOString()}
                                        mode={isSelected ? 'contained' : 'text'}
                                        compact
                                        onPress={() => handleSelectDate(date)}
                                        disabled={isDisabled}
                                        style={[
                                            styles.dayCell,
                                            styles.dayButton,
                                            isToday && styles.todayButton,
                                            isSelected && styles.selectedDayButton,
                                        ]}
                                        labelStyle={[
                                            styles.dayLabel,
                                            isToday && styles.todayLabel,
                                            isSelected && styles.selectedDayLabel,
                                            isDisabled && styles.disabledDayLabel,
                                        ]}
                                    >
                                        {date.getDate()}
                                    </Button>
                                );
                            })}
                        </View>

                        <View style={styles.actions}>
                            <Button mode="text" onPress={closePicker} textColor="#71717a">
                                Annuller
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleConfirm}
                                disabled={!draftDate}
                                buttonColor="#be185d"
                            >
                                Vælg
                            </Button>
                        </View>
                    </View>
                </Modal>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    triggerButton: {
        borderRadius: 12,
        borderColor: '#f5c2d7',
        backgroundColor: '#fffafc',
    },
    triggerButtonContent: {
        paddingVertical: 8,
    },
    triggerButtonLabel: {
        color: '#9d174d',
    },
    modalContainer: {
        margin: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#fbcfe8',
    },
    header: {
        marginBottom: 12,
    },
    headerTitle: {
        color: '#9d174d',
        fontWeight: '700',
        textAlign: 'center',
    },
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    monthLabel: {
        color: '#9d174d',
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    weekdaysRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekdayText: {
        flex: 1,
        textAlign: 'center',
        color: '#a1a1aa',
        fontWeight: '600',
        fontSize: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    dayCell: {
        width: '14.285%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    dayButton: {
        borderRadius: 999,
        minWidth: 40,
    },
    dayLabel: {
        color: '#3f3f46',
        fontWeight: '600',
    },
    todayButton: {
        borderWidth: 1,
        borderColor: '#f9a8d4',
    },
    todayLabel: {
        color: '#be185d',
    },
    selectedDayButton: {
        backgroundColor: '#ec4899',
    },
    selectedDayLabel: {
        color: '#ffffff',
    },
    disabledDayLabel: {
        color: '#d4d4d8',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});