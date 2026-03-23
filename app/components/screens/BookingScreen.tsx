import { useEffect, useMemo, useState } from 'react';
import { CustomDatePicker } from '@/components/CustomDatePicker';
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
    Divider,
    HelperText,
    SegmentedButtons,
    Snackbar,
    Text,
    TextInput,
    TouchableRipple,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { createBooking, getAvailableBookingTimes } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useAdmin } from '@/context/AdminContext';
import { MainTreatment, SelectedOption, TreatmentSelector } from "@/components/booking/TreatmentSelector";
import { ContactDetailsForm } from "@/components/booking/ContactDetailsForm";
import { DatePickerSection } from "@/components/booking/DatePickerSection";
import { TimePickerSection } from "@/components/booking/TimePickerSection";
import { AppSnackbar } from "@/components/common/AppSnackbar";

type MessageState = {
    type: 'success' | 'error';
    text: string;
} | null;

const salonOptions = [
    { label: 'Salon 1', value: '1' },
    { label: 'Salon 2', value: '2' },
];

type BookingScreenProps = {
    isLoggedIn: boolean;
};

export function BookingScreen({ isLoggedIn }: BookingScreenProps) {
    const { user } = useUser();
    const { salons } = useAdmin();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSalon, setSelectedSalon] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hasPickedDate, setHasPickedDate] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<MessageState>(null);
    const [selectedMainTreatment, setSelectedMainTreatment] = useState<MainTreatment>('klipning');
    const [selectedDetail, setSelectedDetail] = useState<SelectedOption | null>(null);

    useEffect(() => {
        if (!isLoggedIn || !user) {
            return;
        }

        setFirstName((current) => current || user.first_name || '');
        setLastName((current) => current || user.last_name || '');
        setPhone((current) => current || user.phone || '');
        setEmail((current) => current || user.email || '');
    }, [isLoggedIn, user]);

    useEffect(() => {
        console.log('Salons:', salons);
    }, [salons])

    const formattedApiDate = useMemo(() => {
        return selectedDate.toLocaleDateString('dk-DK');
    }, [selectedDate]);

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

        void loadAvailableTimes();
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
        setFirstName(isLoggedIn && user ? user.first_name || '' : '');
        setLastName(isLoggedIn && user ? user.last_name || '' : '');
        setPhone(isLoggedIn && user ? user.phone || '' : '');
        setEmail(isLoggedIn && user ? user.email || '' : '');
        setSelectedSalon('');
        setSelectedDate(new Date());
        setHasPickedDate(false);
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
                            <ContactDetailsForm
                                firstName={firstName}
                                lastName={lastName}
                                phone={phone}
                                email={email}
                                onFirstNameChange={setFirstName}
                                onLastNameChange={setLastName}
                                onPhoneChange={setPhone}
                                onEmailChange={setEmail}
                                onChange={clearMessage}
                            />

                            <TreatmentSelector
                                selectedMainTreatment={selectedMainTreatment}
                                selectedDetail={selectedDetail}
                                onSelectMainTreatment={(treatment) => {
                                    setSelectedMainTreatment(treatment);
                                    setSelectedDetail(null);
                                }}
                                onSelectDetail={setSelectedDetail}
                            />

                            <DatePickerSection
                                selectedDate={hasPickedDate ? selectedDate : null}
                                onDateChange={(date) => {
                                    setSelectedDate(date);
                                    setHasPickedDate(true);
                                    setSelectedTime('');
                                    clearMessage();
                                }}
                                onChange={clearMessage}
                            />

                            <TimePickerSection
                                selectedSalon={selectedSalon}
                                selectedDate={hasPickedDate ? selectedDate : null}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                                onChange={clearMessage}
                            />

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

                <AppSnackbar
                    visible={!!message}
                    message={message?.text ?? ''}
                    type={message?.type ?? 'info'}
                    onDismiss={() => setMessage(null)}
                    duration={3500}
                />
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
    segmentedButtons: {
        marginTop: 2,
    },
    helperText: {
        marginTop: 0,
        paddingHorizontal: 0,
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