import {useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {useUser} from '@/context/UserContext';
import {newBooking} from '@/api/Booking';
import {AppSnackbar} from '@/components/common/AppSnackbar';
import {ContactDetailsForm} from '@/components/booking/ContactDetailsForm';
import {DatePickerSection} from '@/components/booking/DatePickerSection';
import {TimePickerSection} from '@/components/booking/TimePickerSection';
import {TreatmentSelector, type MainTreatment, type SelectedOption} from '@/components/booking/TreatmentSelector';
import {type Salon} from '@/api/Salon';
import {type Employee} from '@/api/Employee';

type MessageState = {
    type: 'success' | 'error';
    text: string;
} | null;

type BookingFormStepProps = {
    salon: Salon | null;
    employee: Employee | null;
    onBack: () => void;
};

export function BookingFormStep({salon, employee, onBack}: BookingFormStepProps) {
    const {user} = useUser();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hasPickedDate, setHasPickedDate] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<MessageState>(null);
    const [selectedMainTreatment, setSelectedMainTreatment] = useState<MainTreatment>('klipning');
    const [selectedDetail, setSelectedDetail] = useState<SelectedOption | null>(null);

    useEffect(() => {
        setFirstName((current) => current || user?.first_name || '');
        setLastName((current) => current || user?.last_name || '');
        setPhone((current) => current || user?.phone || '');
        setEmail((current) => current || user?.email || '');
    }, [user]);

    const formattedApiDate = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }, [selectedDate]);

    const canSubmit =
        !!firstName.trim() &&
        !!lastName.trim() &&
        !!phone.trim() &&
        !!email.trim() &&
        !!salon?.id &&
        !!employee?.id &&
        !!hasPickedDate &&
        !!selectedTime &&
        !isSubmitting;

    function clearMessage() {
        setMessage(null);
    }

    function validateForm() {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !phone.trim() ||
            !email.trim() ||
            !salon?.id ||
            !employee?.id ||
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

    async function handleSubmit() {
        clearMessage();

        const validationError = validateForm();
        if (validationError) {
            setMessage({type: 'error', text: validationError});
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                salon_id: String(salon?.id),
                employee_id: String(employee?.id),
                date: `${formattedApiDate}T${selectedTime}:00`,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim(),
                email: email.trim(),
            };

            const response = await newBooking(payload);

            if (!response.success) {
                throw new Error('Booking kunne ikke oprettes.');
            }

            setMessage({
                type: 'success',
                text: 'Booking oprettet! Vi glæder os til at se dig.',
            });

            setSelectedTime('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Der opstod en fejl. Prøv igen senere.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
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
                                Fuldfør booking
                            </Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>
                                {salon?.name ?? 'Salon'} · {employee?.user.information.first_name ?? 'Medarbejder'}
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
                                selectedSalon={String(salon?.id ?? '')}
                                selectedEmployee={String(employee?.id ?? '')}
                                selectedDate={hasPickedDate ? selectedDate : null}
                                selectedTime={selectedTime}
                                onSelectTime={setSelectedTime}
                                onChange={clearMessage}
                            />

                            <View style={styles.summary}>
                                <Text variant="bodyMedium" style={styles.summaryText}>
                                    Salon: {salon?.name ?? 'Ikke valgt'}
                                </Text>
                                <Text variant="bodyMedium" style={styles.summaryText}>
                                    Medarbejder: {employee?.user.information.first_name ?? 'Ikke valgt'}{' '}
                                    {employee?.user.information.last_name ?? ''}
                                </Text>
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

                            <Button mode="text" onPress={onBack} style={styles.backButton}>
                                Tilbage
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
        shadowOffset: {width: 0, height: 2},
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
    summary: {
        gap: 4,
        paddingTop: 4,
    },
    summaryText: {
        color: '#52525b',
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
    backButton: {
        alignSelf: 'center',
    },
});