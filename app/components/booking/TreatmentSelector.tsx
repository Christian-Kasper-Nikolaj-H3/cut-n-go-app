import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Divider, Text, TouchableRipple } from 'react-native-paper';

export type MainTreatment =
    | 'klipning'
    | 'permanent'
    | 'striber'
    | 'helfarvning'
    | 'toning'
    | 'kombinationer';

export type SelectedOption = {
    title: string;
    detail: string;
    price: string;
};

type TreatmentCard = {
    id: MainTreatment;
    title: string;
    subtitle: string;
    hint: string;
};

type TreatmentSelectorProps = {
    selectedMainTreatment: MainTreatment;
    selectedDetail: SelectedOption | null;
    onSelectMainTreatment: (treatment: MainTreatment) => void;
    onSelectDetail: (option: SelectedOption) => void;
};

const treatmentCards: TreatmentCard[] = [
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
    { title: 'Herre', detail: 'Voksen herre', price: '180,-' },
    { title: 'Dame', detail: 'Voksen dame', price: '250,-' },
    { title: 'Barn', detail: 'Under 12 år', price: '170,-' },
    { title: 'Herre (pensionist)', detail: 'Pensionist', price: '170,-' },
    { title: 'Dame (pensionist)', detail: 'Pensionist', price: '230,-' },
];

const permanentOptions: SelectedOption[] = [
    { title: 'Kort', detail: 'Permanent', price: 'Fra 550,-' },
    { title: 'Mellem', detail: 'Permanent', price: 'Fra 750,-' },
    { title: 'Langt', detail: 'Permanent', price: 'Fra 950,-' },
];

const striberOptions: SelectedOption[] = [
    { title: 'Kort', detail: 'Striber', price: 'Fra 550,-' },
    { title: 'Mellem', detail: 'Striber', price: 'Fra 750,-' },
    { title: 'Langt', detail: 'Striber', price: 'Fra 850,-' },
    { title: 'Hætte striber', detail: 'Striber', price: 'Fra 400,-' },
];

const helfarvningOptions: SelectedOption[] = [
    { title: 'Kort', detail: 'Helfarvning', price: '350,-' },
    { title: 'Mellem', detail: 'Helfarvning', price: '600,-' },
    { title: 'Langt', detail: 'Helfarvning', price: '700 - 1000,-' },
];

const toningOptions: SelectedOption[] = [
    { title: 'Bund 2-3 cm', detail: 'Toning', price: '350,-' },
];

const comboOptions: SelectedOption[] = [
    { title: 'Klipning + Permanent', detail: 'Pakke', price: 'Fra 730,-' },
    { title: 'Klipning + Striber', detail: 'Pakke', price: 'Fra 730,-' },
    { title: 'Klipning + Helfarvning', detail: 'Pakke', price: 'Fra 530,-' },
    { title: 'Klipning + Toning', detail: 'Pakke', price: 'Fra 530,-' },
];

export function TreatmentSelector({
                                      selectedMainTreatment,
                                      selectedDetail,
                                      onSelectMainTreatment,
                                      onSelectDetail,
                                  }: TreatmentSelectorProps) {
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

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vælg behandling *</Text>

            {treatmentCards.map((card) => {
                const isSelected = selectedMainTreatment === card.id;

                return (
                    <TouchableRipple
                        key={card.id}
                        onPress={() => onSelectMainTreatment(card.id)}
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

                            {isSelected ? (
                                <View style={styles.expandedArea}>
                                    <Divider style={styles.divider} />

                                    <View style={styles.chipGrid}>
                                        {detailOptions.map((option) => {
                                            const isDetailSelected =
                                                selectedDetail?.title === option.title &&
                                                selectedDetail?.price === option.price;

                                            return (
                                                <Chip
                                                    key={`${option.title}-${option.price}`}
                                                    selected={isDetailSelected}
                                                    onPress={() => onSelectDetail(option)}
                                                    style={[
                                                        styles.optionChip,
                                                        isDetailSelected && styles.optionChipSelected,
                                                    ]}
                                                    textStyle={[
                                                        styles.optionChipText,
                                                        isDetailSelected && styles.optionChipTextSelected,
                                                    ]}
                                                >
                                                    {option.title}
                                                </Chip>
                                            );
                                        })}
                                    </View>

                                    {selectedDetail ? (
                                        <View style={styles.summaryBox}>
                                            <Text variant="titleSmall" style={styles.summaryText}>
                                                Valgt Behandling
                                            </Text>
                                            <Text variant="bodyMedium" style={styles.summaryText}>
                                                {selectedMainTreatment === 'kombinationer'
                                                    ? selectedDetail.title
                                                    : `${card.title} + ${selectedDetail.title}`}
                                            </Text>
                                            <Text variant="bodyMedium" style={styles.summaryPrice}>
                                                {selectedDetail.price}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            ) : null}
                        </View>
                    </TouchableRipple>
                );
            })}
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
    cardTitle: {
        color: '#111827',
        fontWeight: '700',
        flex: 1,
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
    summaryText: {
        color: '#374151',
    },
    summaryPrice: {
        color: '#be185d',
        fontWeight: '800',
    },
});