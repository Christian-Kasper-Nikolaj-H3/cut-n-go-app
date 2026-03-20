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

type MainTreatment = 'klipning' | 'permanent' | 'striber' | 'helfarvning' | 'toning' | 'kombinationer';

type SelectedOption = {
    title: string;
    detail: string;
    price: string;
};

const treatmentCards: { id: MainTreatment; title: string; subtitle: string; hint: string; }[] = [
    {
        id: 'klipning',
        title: 'Klipning',
        subtitle: 'Herre, dame, barn og pensionist',
        hint: 'Vælg den type klipning kunden ønsker',
    },
    {
        id: 'permanent',
        title: 'Permanent',
        subtitle: 'Kort, mellem eller langt hår',
        hint: 'Pris afhænger af hårlængde',
    },
    {
        id: 'striber',
        title: 'Striber',
        subtitle: 'Kort, mellem, langt eller hætte striber',
        hint: 'Vælg metode og hårlænge',
    },
    {
        id: 'helfarvning',
        title: 'Helfarvning',
        subtitle: 'Kort, mellem eller langt hår',
        hint: 'Vælg hårlængde for pris',
    },
    {
        id: 'toning',
        title: 'Toning',
        subtitle: 'Bund 2-3 cm',
        hint: 'En enkel toning-behandling',
    },
    {
        id: 'kombinationer',
        title: 'Kombinationer',
        subtitle: 'Predefinerede combo-behandlinger',
        hint: 'Vælg en godkendt kombination',
    },
];

const klipningOptions: SelectedOption[] = [
    { title: 'Herre', detail: 'Voksen herre', price: '180,-'},
    { title: 'Dame', detail: 'Voksen dame', price: '250,-'},
    { title: 'Barn', detail: 'Under 12 år', price: '170,-'},
    { title: 'Herre (pensionist)', detail: 'Pensionist', price: '170,-'},
    { title: 'Dame (pensionist)', detail: 'Pensionist', price: '230,-'},
];

const permanentOptions: SelectedOption[] = [
    { title: 'Kort', detail: 'Permanent', price: 'Fra 550,-'},
    { title: 'Mellem', detail: 'Permanent', price: 'Fra 750,-'},
    { title: 'Langt', detail: 'Permanent', price: 'Fra 950,-'},
];

const striberOptions: SelectedOption[] = [
    { title: 'Kort', detail: 'Striber', price: 'Fra 550,-'},
    { title: 'Mellem', detail: 'Striber', price: 'Fra 750,-'},
    { title: 'Langt', detail: 'Striber', price: 'Fra 850,-'},
    { title: 'Hætte striber', detail: 'Striber', price: 'Fra 400,-'},
];

const helfarvningOptions: SelectedOption[] = [
    { title: 'Kort', detail: 'Helfarvning', price: '350,-'},
    { title: 'Mellem', detail: 'Helfarvning', price: '600,-'},
    { title: 'Langt', detail: 'Helfarvning', price: '700 - 1000,-'},
];

const toningOptions: SelectedOption[] = [
    { title: 'Bund 2-3 cm', detail: 'Toning', price: '350,-'},
];

const comboOptions: SelectedOption[] = [
    { title: 'Klipning + Permanent', detail: 'Pakke', price: 'Fra 730,-' },
    { title: 'Klipning + Striber', detail: 'Pakke', price: 'Fra 730,-' },
    { title: 'Klipning + Helfarvning', detail: 'Pakke', price: 'Fra 530,-' },
    { title: 'Klipning + Toning', detail: 'Pakke', price: 'Fra 530,-' },
];

export function BookingScreen({ isLoggedIn }: BookingScreenProps) {
    const { user } = useUser();
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
    const [selectedMainTreatment, setSelectedMainTreatment] = useState('klipning');
    const [selectedDetail, setSelectedDetail] = useState<SelectedOption | null>(null);

    useEffect(() => {
        if (!isLoggedIn || !user) {
            return;
        }

        setFirstName((current) => current || user.name || '');
        setLastName((current) => current || user.surname || '');
        setPhone((current) => current || user.phone || '');
        setEmail((current) => current || user.email || '');
    }, [isLoggedIn, user]);

    const formattedApiDate = useMemo(() => {
        return selectedDate.toLocaleDateString('dk-DK');
    }, [selectedDate]);

    const detailOptions = useMemo(() => {
        switch (selectedMainTreatment) {
            case 'klipning':
                return klipningOptions;
            case 'permanent':
                return permanentOptions;
            case 'striber':
                return striberOptions;
            case 'helfarvning':
                return helfarvningOptions;
            case 'toning':
                return toningOptions;
            case 'kombinationer':
                return comboOptions;
            default:
                return [];
        }
    }, [selectedMainTreatment]);

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
        setFirstName(isLoggedIn && user ? user.name || '' : '');
        setLastName(isLoggedIn && user ? user.surname || '' : '');
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
                                <Text style={styles.sectionTitle}>
                                    Vælg behandling *
                                </Text>

                                {
                                    treatmentCards.map((card) => {
                                        const isSelected = selectedMainTreatment === card.id;

                                        return (
                                            <TouchableRipple
                                                key={card.id}
                                                onPress={() => {
                                                    setSelectedMainTreatment(card.id);
                                                    setSelectedDetail(null);
                                                }}
                                                style={[
                                                    styles.treatmentCard,
                                                    isSelected && styles.treatmentCardSelected,
                                                ]}
                                            >
                                                <View>
                                                    <Text variant="titleMedium" style={styles.cardTitle}>
                                                        {card.title}
                                                    </Text>
                                                    <Text variant="bodyMedium" style={styles.cardSubtitle}>
                                                        {card.subtitle}
                                                    </Text>
                                                    <Text variant="bodySmall" style={styles.cardHint}>
                                                        {card.hint}
                                                    </Text>
                                                    {
                                                        isSelected ? (
                                                            <View style={styles.expandedArea}>
                                                                <Divider style={styles.divider} />

                                                                <View style={styles.chipGrid}>
                                                                    {
                                                                        detailOptions.map((option) => {
                                                                            const selected =
                                                                                selectedDetail?.title === option.title &&
                                                                                selectedDetail?.price === option.price;

                                                                            return (
                                                                                <Chip
                                                                                    key={`${option.title}-${option.price}`}
                                                                                    selected={selected}
                                                                                    onPress={() => setSelectedDetail(option)}
                                                                                    style={[
                                                                                        styles.optionChip,
                                                                                        selected && styles.optionChipSelected,
                                                                                    ]}
                                                                                    textStyle={[
                                                                                        styles.optionChipText,
                                                                                        selected && styles.optionChipTextSelected,
                                                                                    ]}
                                                                                >
                                                                                    {option.title}
                                                                                </Chip>
                                                                            );
                                                                        })
                                                                    }
                                                                </View>

                                                                {
                                                                    selectedDetail ? (
                                                                        <View style={styles.summaryBox}>
                                                                            <Text variant="titleSmall" style={styles.summaryText}>
                                                                                Valgt Behandling
                                                                            </Text>
                                                                            <Text variant="bodyMedium" style={styles.summaryText}>
                                                                                {
                                                                                    selectedMainTreatment === 'kombinationer'
                                                                                        ? selectedDetail.title
                                                                                        : `${card.title} + ${selectedDetail.title}`
                                                                                }
                                                                            </Text>
                                                                            <Text variant="bodyMedium" style={styles.summaryPrice}>
                                                                                {selectedDetail.price}
                                                                            </Text>
                                                                        </View>
                                                                    ) : null
                                                                }
                                                            </View>
                                                        ) : null
                                                    }
                                                </View>


                                            </TouchableRipple>
                                        );
                                    })
                                }
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
                                <CustomDatePicker
                                    value={hasPickedDate ? selectedDate : null}
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                        setHasPickedDate(true);
                                        setSelectedTime('');
                                        clearMessage();
                                    }}
                                    minimumDate={new Date()}
                                />
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
    treatmentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    treatmentCardSelected: {
        borderColor: '#ec4899',
        backgroundColor: '#fffafc',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    cardTitle: {
        color: '#111827',
        fontWeight: '700',
        flex: 1,
    },
    selectedChip: {
        backgroundColor: '#fce7f3',
    },
    cardSubtitle: {
        color: '#4b5563',
        marginTop: 4,
    },
    cardHint: {
        color: '#9ca3af',
        marginTop: 4,
    },
    expandedArea: {
        marginTop: 14,
        gap: 12,
    },
    divider: {
        backgroundColor: '#fbcfe8',
    },
    detailTitle: {
        color: '#9d174d',
        fontWeight: '700',
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionChip: {
        backgroundColor: '#fff',
        borderColor: '#f5c2d7',
    },
    optionChipSelected: {
        backgroundColor: '#ec4899',
        borderColor: '#ec4899',
    },
    optionChipText: {
        color: '#9d174d',
    },
    optionChipTextSelected: {
        color: '#ffffff',
    },
    summaryBox: {
        marginTop: 4,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#fdf2f8',
        borderWidth: 1,
        borderColor: '#fbcfe8',
        gap: 4,
    },
    summaryTitle: {
        color: '#9d174d',
        fontWeight: '700',
    },
    summaryText: {
        color: '#374151',
    },
    summaryPrice: {
        color: '#be185d',
        fontWeight: '800',
    },
});