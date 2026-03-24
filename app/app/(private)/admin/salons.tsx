import {useMemo, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import { useSalon } from '@/context/SalonContext';
import {Button, Card, Chip, IconButton, Portal, Snackbar, Text} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import {SalonActionModal} from '@/components/admin/SalonActionModal';
import {SalonFormFields, type SalonFormState} from '@/components/admin/SalonFormFields';

type ActiveModal = 'create' | 'edit' | 'delete' | null;

export default function AdminSalonsScreen() {
    const { createSalon, updateSalon, deleteSalon, salons } = useSalon();
    const [form, setForm] = useState<SalonFormState>({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [editingSalonId, setEditingSalonId] = useState<number | null>(null);
    const [deletingSalonId, setDeletingSalonId] = useState<number | null>(null);
    const [deletingSalonName, setDeletingSalonName] = useState('');

    const canSubmit = useMemo(
        () =>
            !!form.name.trim() &&
            !!form.address.trim() &&
            !!form.city.trim() &&
            !!form.phone.trim() &&
            !!form.email.trim() &&
            !isSaving,
        [form, isSaving]
    );

    function resetFormFields() {
        setForm({
            name: '',
            address: '',
            city: '',
            phone: '',
            email: '',
        });
    }

    function openModal(
        modal: Exclude<ActiveModal, null>,
        salon?: { id?: number; name: string; address: string; city: string; phone: string; email: string }
    ) {
        if (modal === 'edit' && salon) {
            setEditingSalonId(salon.id ?? null);
            setForm({
                name: salon.name,
                address: salon.address,
                city: salon.city,
                phone: salon.phone,
                email: salon.email,
            });
        }

        if (modal === 'delete' && salon) {
            setDeletingSalonId(salon.id ?? null);
            setDeletingSalonName(salon.name);
        }

        if (modal === 'create') {
            resetFormFields();
        }

        setActiveModal(modal);
    }

    function closeModal() {
        setActiveModal(null);
        setEditingSalonId(null);
        setDeletingSalonId(null);
        setDeletingSalonName('');
        resetFormFields();
    }

    async function handleCreate() {
        if (!canSubmit) {
            return;
        }

        setIsSaving(true);
        try {
            await createSalon(
                form.name.trim(),
                form.address.trim(),
                form.city.trim(),
                form.phone.trim(),
                form.email.trim()
            );
            resetFormFields();
            setActiveModal(null);
            setMessage('Salon oprettet');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke oprette salon');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleUpdate() {
        if (!canSubmit || editingSalonId === null) {
            return;
        }

        setIsSaving(true);
        try {
            await updateSalon(
                editingSalonId,
                form.name.trim(),
                form.address.trim(),
                form.city.trim(),
                form.phone.trim(),
                form.email.trim()
            );
            setActiveModal(null);
            setEditingSalonId(null);
            resetFormFields();
            setMessage('Salon opdateret');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke opdatere salon');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleConfirmDelete() {
        if (deletingSalonId === null) {
            return;
        }

        setIsSaving(true);
        try {
            await deleteSalon(deletingSalonId);
            setMessage(`"${deletingSalonName}" er slettet`);
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke slette salon');
        } finally {
            setIsSaving(false);
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
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <Card style={styles.card}>
                        <Card.Title title="Opret salon" />
                        <Card.Content>
                            <Button mode="contained" icon="plus" onPress={() => openModal('create')}>
                                Ny salon
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>
                                Saloner
                            </Text>
                            <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                                {salons.length}
                            </Chip>
                        </View>
                        <Card.Content>
                            <FlatList
                                data={salons}
                                keyExtractor={(item, index) => `${item.id ?? item.email}-${index}`}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                renderItem={({ item }) => (
                                    <View style={styles.row}>
                                        <View style={styles.rowInfo}>
                                            <Text variant="titleMedium" style={styles.rowTitle}>{item.name}</Text>
                                            <Text variant="bodySmall" style={styles.rowSubtitle}>{item.city} · {item.phone}</Text>
                                        </View>
                                        <View style={styles.rowActions}>
                                            <IconButton icon="pencil" onPress={() => openModal('edit', item)} />
                                            <IconButton icon="delete" onPress={() => openModal('delete', item)} />
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={<Text variant="bodyMedium" style={styles.emptyText}>Ingen saloner endnu.</Text>}
                            />
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>

            <Snackbar visible={!!message} onDismiss={() => setMessage(null)} duration={3000}>
                {message ?? ''}
            </Snackbar>

            <Portal>
                <SalonActionModal
                    visible={activeModal === 'create'}
                    title="Opret salon"
                    primaryLabel="Opret"
                    secondaryLabel="Luk"
                    onPrimaryPress={handleCreate}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!canSubmit}
                    secondaryDisabled={isSaving}
                >
                    <SalonFormFields value={form} onChange={(patch) => setForm((prev) => ({...prev, ...patch}))} />
                </SalonActionModal>

                <SalonActionModal
                    visible={activeModal === 'edit'}
                    title="Rediger salon"
                    subtitle="Opdater oplysningerne og gem dine ændringer."
                    primaryLabel="Gem ændringer"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleUpdate}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!canSubmit || editingSalonId === null}
                    secondaryDisabled={isSaving}
                >
                    <SalonFormFields value={form} onChange={(patch) => setForm((prev) => ({...prev, ...patch}))} />
                </SalonActionModal>

                <SalonActionModal
                    visible={activeModal === 'delete'}
                    title="Bekræft sletning"
                    primaryLabel="Slet"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleConfirmDelete}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={isSaving || deletingSalonId === null}
                    secondaryDisabled={isSaving}
                    variant="danger"
                    subtitle={`Er du sikker på, at du vil slette ${deletingSalonName ? `"${deletingSalonName}"` : 'denne salon'}?`}
                />
            </Portal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 30,
    },
    wrapper: {
        gap: 18,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
    },
    rowInfo: {
        flex: 1,
    },
    rowTitle: {
        color: '#be185d',
        fontWeight: '700',
    },
    rowSubtitle: {
        color: '#52525b',
    },
    rowActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#fce7f3',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 6,
    },
    sectionTitle: {
        color: '#9d174d',
        fontWeight: '700',
        flex: 1,
    },
    countChip: {
        backgroundColor: '#fdf2f8',
        borderColor: '#f5c2d7',
    },
    countChipText: {
        color: '#be185d',
        fontWeight: '700',
    },
    emptyText: {
        textAlign: 'center',
        color: '#71717a',
        paddingVertical: 8,
    },
    modalSubtitle: {
        color: '#52525b',
        opacity: 0.85,
    },
});
