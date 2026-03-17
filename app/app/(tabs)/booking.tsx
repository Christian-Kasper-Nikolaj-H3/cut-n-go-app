import { useEffect, useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Chip,
    HelperText,
    SegmentedButtons,
    Snackbar,
    Text,
    TextInput,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { createBooking, getAvailableBookingTimes } from '@/services/api';

type MessageState = {
    type: 'success' | 'error';
    text: string;
} | null;

const salonOptions = [
    { label: 'Salon 1', value: '1' },
    { label: 'Salon 2', value: '2' },
];

export default function Booking() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSalon, setSelectedSalon] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hasPickedDate, setHasPickedDate] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<MessageState>(null);

    const formattedApiDate = useMemo(() => {
        return selectedDate.toLocaleDateString('sv-SE');
    }, [selectedDate]);

    const formattedDateLabel = useMemo(() => {
        if (!hasPickedDate) {
            return 'Vælg dato';
        }

        return selectedDate.toLocaleDateString('da-DK', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [hasPickedDate, selectedDate]);

    const canSubmit =
        !!firstName.trim() &&
        !!lastName.trim() &&
        !!phone.trim() &&
        !!email.trim() &&
        !!selectedSalon &&
        !!hasPickedDate &&
        !!selectedTime &&
        !isSubmitting;

    useEffect(() => {
        async function loadAvailableTimes() {
            if (!selectedSalon || !hasPickedDate) {
                setAvailableTimes([]);
                setSelectedTime('');
                return;
            }

            setIsLoadingTimes(true);
            setSelectedTime('');

            try {
                const data = await getAvailableBookingTimes(selectedSalon, formattedApiDate);

                if (Array.isArray(data.availableTimes)) {
                    setAvailableTimes(data.availableTimes);
                } else {
                    setAvailableTimes([]);
                    setMessage({
                        type: 'error',
                        text: 'Kunne ikke hente ledige tider.',
                    });
                }
            } catch (error) {
                setAvailableTimes([]);
                setMessage({
                    type: 'error',
                    text: error instanceof Error
                        ? error.message
                        : 'Kunne ikke hente ledige tider.',
                });
            } finally {
                setIsLoadingTimes(false);
            }
        }

        loadAvailableTimes();
    }, [selectedSalon, hasPickedDate, formattedApiDate]);

    function clearMessage() {
        if (message) {
            setMessage(null);
        }
    }

    function validateForm() {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !phone.trim() ||
            !email.trim() ||
            !selectedSalon ||
            !hasPickedDate ||
            !selectedTime
        ) {
            return 'Udfyld alle obligatoriske felter.';
        }

        if (!email.trim().includes('@')) {
            return 'Indtast en gyldig email.';
        }

        if (phone.trim().length < 8) {
            return 'Indtast et gyldigt telefonnummer.';
        }

        return null;
    }

    function resetForm() {
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setSelectedSalon('');
        setSelectedDate(new Date());
        setHasPickedDate(false);
        setShowDatePicker(false);
        setSelectedTime('');
        setAvailableTimes([]);
    }

    async function handleSubmit() {
        clearMessage();

        const validationError = validateForm();

        if (validationError) {
            setMessage({
                type: 'error',
                text: validationError,
            });
            return;
        }

        try {
            setIsSubmitting(true);

            await createBooking({
                SalonID: selectedSalon,
                KundeFornavn: firstName.trim(),
                KundeEfternavn: lastName.trim(),
                KundeTelefon: phone.trim(),
                KundeEmail: email.trim(),
                BestillingDato: `${formattedApiDate}T${selectedTime}:00`,
            });

            setMessage({
                type: 'success',
                text: 'Booking oprettet! Vi glæder os til at se dig.',
            });

            resetForm();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error
                    ? error.message
                    : 'Der opstod en fejl. Prøv igen senere.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Card style={styles.card}>
                        <View style={styles.header}>
                            <Text variant="headlineMedium" style={styles.title}>
                                Book tid
                            </Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>
                                Vælg salon, dato og tidspunkt for din behandling
                            </Text>
                        </View>

                        <Card.Content style={styles.form}>
                            <View style={styles.row}>
                                <TextInput
                                    label="Fornavn *"
                                    value={firstName}
                                    onChangeText={(text) => {
                                        setFirstName(text);
                                        clearMessage();
                                    }}
                                    mode="outlined"
                                    style={styles.flex}
                                />
                                <TextInput
                                    label="Efternavn *"
                                    value={lastName}
                                    onChangeText={(text) => {
                                        setLastName(text);
                                        clearMessage();
                                    }}
                                    mode="outlined"
                                    style={styles.flex}
                                />
                            </View>

                            <View style={styles.row}>
                                <TextInput
                                    label="Telefon *"
                                    value={phone}
                                    onChangeText={(text) => {
                                        setPhone(text);
                                        clearMessage();
                                    }}
                                    mode="outlined"
                                    keyboardType="phone-pad"
                                    style={styles.flex}
                                />
                                <TextInput
                                    label="Email *"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        clearMessage();
                                    }}
                                    mode="outlined"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.flex}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text variant="titleSmall" style={styles.sectionTitle}>
                                    Vælg salon *
                                </Text>
                                <SegmentedButtons
                                    value={selectedSalon}
                                    onValueChange={(value) => {
                                        setSelectedSalon(value);
                                        setSelectedTime('');
                                        clearMessage();
                                    }}
                                    buttons={salonOptions}
                                    style={styles.segmentedButtons}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text variant="titleSmall" style={styles.sectionTitle}>
                                    Dato *
                                </Text>
                                <Button
                                    mode="outlined"
                                    icon="calendar"
                                    onPress={() => {
                                        setShowDatePicker(true);
                                        clearMessage();
                                    }}
                                    style={styles.dateButton}
                                    contentStyle={styles.dateButtonContent}
                                    labelStyle={styles.dateButtonLabel}
                                >
                                    {formattedDateLabel}
                                </Button>

                                {showDatePicker ? (
                                    <DateTimePicker
                                        value={selectedDate}
                                        mode="date"
                                        minimumDate={new Date()}
                                        onChange={(_, date) => {
                                            setShowDatePicker(false);

                                            if (date) {
                                                setSelectedDate(date);
                                                setHasPickedDate(true);
                                                setSelectedTime('');
                                                clearMessage();
                                            }
                                        }}
                                    />
                                ) : null}
                            </View>

                            <View style={styles.section}>
                                <Text variant="titleSmall" style={styles.sectionTitle}>
                                    Tidspunkt *
                                </Text>

                                {!selectedSalon || !hasPickedDate ? (
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
                                                    setSelectedTime(time);
                                                    clearMessage();
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

                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                loading={isSubmitting}
                                disabled={!canSubmit}
                                style={styles.submitButton}
                                contentStyle={styles.submitButtonContent}
                                labelStyle={styles.submitButtonLabel}
                            >
                                Book tid
                            </Button>
                        </Card.Content>
                    </Card>
                </ScrollView>

                <Snackbar
                    visible={!!message}
                    onDismiss={() => setMessage(null)}
                    duration={3500}
                    style={
                        message?.type === 'success'
                            ? styles.successSnackbar
                            : styles.errorSnackbar
                    }
                >
                    {message?.text ?? ''}
                </Snackbar>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    header: {
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 8,
        alignItems: 'center',
        gap: 4,
    },
    title: {
        fontWeight: '700',
        color: '#be185d',
        textAlign: 'center',
    },
    subtitle: {
        opacity: 0.6,
        textAlign: 'center',
    },
    form: {
        padding: 24,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex: {
        flex: 1,
    },
    section: {
        gap: 8,
    },
    sectionTitle: {
        color: '#9d174d',
        fontWeight: '700',
    },
    segmentedButtons: {
        marginTop: 2,
    },
    dateButton: {
        borderRadius: 12,
        borderColor: '#f5c2d7',
        backgroundColor: '#fffafc',
    },
    dateButtonContent: {
        paddingVertical: 8,
    },
    dateButtonLabel: {
        color: '#9d174d',
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
    submitButton: {
        borderRadius: 12,
        marginTop: 4,
        backgroundColor: '#be185d',
    },
    submitButtonContent: {
        paddingVertical: 8,
    },
    submitButtonLabel: {
        color: '#ffffff',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    successSnackbar: {
        backgroundColor: '#166534',
    },
    errorSnackbar: {
        backgroundColor: '#991b1b',
    },
});