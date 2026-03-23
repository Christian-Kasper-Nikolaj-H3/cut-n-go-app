import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CustomDatePicker } from '@/components/CustomDatePicker';

type DatePickerSectionProps = {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
    onChange?: () => void;
};

export function DatePickerSection({
                                      selectedDate,
                                      onDateChange,
                                      onChange,
                                  }: DatePickerSectionProps) {
    return (
        <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
                Dato *
            </Text>

            <CustomDatePicker
                value={selectedDate}
                onChange={(date) => {
                    onDateChange(date);
                    onChange?.();
                }}
                minimumDate={new Date()}
            />
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
});