import {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Divider, Text, TouchableRipple} from 'react-native-paper';
import {useTreatment} from '@/context/TreatmentContext';

export type MainTreatment = string;

export type SelectedOption = {
    title: string;
    detail: string;
    price: string;
};

type TreatmentCard = {
    id: string;
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

export function TreatmentSelector({
                                      selectedMainTreatment,
                                      selectedDetail,
                                      onSelectMainTreatment,
                                      onSelectDetail,
                                  }: TreatmentSelectorProps) {
    const {categories, treatments} = useTreatment();

    const treatmentCards = useMemo<TreatmentCard[]>(() => {
        return categories.map((category) => {
            const categoryTreatments = treatments.filter(
                (treatment) => treatment.category_id === category.id
            );

            return {
                id: category.title.toLowerCase(),
                title: category.title,
                subtitle: category.description ?? `${categoryTreatments.length} behandlinger`,
                hint: categoryTreatments.length > 0
                    ? 'Vælg en behandling i denne kategori'
                    : 'Ingen behandlinger tilgængelige endnu',
            };
        });
    }, [categories, treatments]);

    const detailOptions = useMemo(() => {
        const selectedCategory = categories.find(
            (category) => category.title.toLowerCase() === selectedMainTreatment.toLowerCase()
        );

        if (!selectedCategory) {
            return [];
        }

        return treatments
            .filter((treatment) => treatment.category_id === selectedCategory.id)
            .map((treatment) => ({
                title: treatment.name,
                detail: selectedCategory.description ?? '',
                price: treatment.price,
            }));
    }, [selectedMainTreatment, treatments, categories]);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vælg behandling *</Text>

            {treatmentCards.map((card) => {
                const isSelected = selectedMainTreatment.toLowerCase() === card.id;

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
                                                {selectedDetail.title}
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