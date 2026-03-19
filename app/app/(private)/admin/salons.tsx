import {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import { useAdmin } from '@/context/AdminContext';
import {Button, Card, Chip, IconButton, Modal, Portal, Snackbar, Text, TextInput} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';


export default function AdminSalonsScreen() {
    const { createSalon, updateSalon, deleteSalon, salons } = useAdmin();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingSalonId, setEditingSalonId] = useState<number | null>(null);
    const [deletingSalonId, setDeletingSalonId] = useState<number | null>(null);
    const [deletingSalonName, setDeletingSalonName] = useState('');

    const canSubmit =
        !!name.trim() &&
        !!address.trim() &&
        !!city.trim() &&
        !!phone.trim() &&
        !!email.trim() &&
        !isSaving;

    function resetFormFields() {
        setName('');
        setAddress('');
        setCity('');
        setPhone('');
        setEmail('');
    }

    async function handleCreate() {
        if (!canSubmit) {
            return;
        }

        setIsSaving(true);
        try {
            await createSalon(name.trim(), address.trim(), city.trim(), phone.trim(), email.trim());
            resetFormFields();
            setIsCreateModalVisible(false);
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
                name.trim(),
                address.trim(),
                city.trim(),
                phone.trim(),
                email.trim()
            );
            setIsEditModalVisible(false);
            setEditingSalonId(null);
            resetFormFields();
            setMessage('Salon opdateret');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke opdatere salon');
        } finally {
            setIsSaving(false);
        }
    }

    function openEditModal(salon: { id?: number; name: string; address: string; city: string; phone: string; email: string }) {
        setEditingSalonId(salon.id ?? null);
        setName(salon.name);
        setAddress(salon.address);
        setCity(salon.city);
        setPhone(salon.phone);
        setEmail(salon.email);
        setIsEditModalVisible(true);
    }

    function closeEditModal() {
        setIsEditModalVisible(false);
        setEditingSalonId(null);
        resetFormFields();
    }

    function closeCreateModal() {
        setIsCreateModalVisible(false);
        resetFormFields();
    }

    function openDeleteModal(salon: { id?: number; name: string }) {
        setDeletingSalonId(salon.id ?? null);
        setDeletingSalonName(salon.name);
        setIsDeleteModalVisible(true);
    }

    function closeDeleteModal() {
        setIsDeleteModalVisible(false);
        setDeletingSalonId(null);
        setDeletingSalonName('');
    }

    async function handleConfirmDelete() {
        if (deletingSalonId === null) {
            return;
        }

        setIsSaving(true);
        try {
            await deleteSalon(deletingSalonId);
            setMessage(`"${deletingSalonName}" er slettet`);
            closeDeleteModal();
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
                            <Button mode="contained" icon="plus" onPress={() => setIsCreateModalVisible(true)}>
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
                                            <IconButton icon="pencil" onPress={() => openEditModal(item)} />
                                            <IconButton icon="delete" onPress={() => openDeleteModal(item)} />
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
                <Modal
                    visible={isCreateModalVisible}
                    onDismiss={closeCreateModal}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text variant="titleLarge">Opret salon</Text>
                    <View style={styles.form}>
                        <TextInput label="Navn" mode="outlined" value={name} onChangeText={setName} />
                        <TextInput label="Adresse" mode="outlined" value={address} onChangeText={setAddress} />
                        <TextInput label="By" mode="outlined" value={city} onChangeText={setCity} />
                        <TextInput label="Telefon" mode="outlined" value={phone} onChangeText={setPhone} />
                        <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} />
                        <Button
                            mode="contained"
                            buttonColor="#be185d"
                            textColor="#ffffff"
                            onPress={handleCreate}
                            loading={isSaving}
                            disabled={!canSubmit}
                            style={styles.primaryAction}
                        >
                            Opret
                        </Button>
                        <Button
                            mode="text"
                            textColor="#9d174d"
                            onPress={closeCreateModal}
                            disabled={isSaving}
                            style={styles.secondaryAction}
                        >
                            Luk
                        </Button>
                    </View>
                </Modal>

                <Modal
                    visible={isEditModalVisible}
                    onDismiss={closeEditModal}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text variant="headlineSmall" style={styles.modalTitle}>Rediger salon</Text>
                    <Text variant="bodyMedium" style={styles.modalSubtitle}>
                        Opdater oplysningerne og gem dine ændringer.
                    </Text>
                    <View style={styles.form}>
                        <TextInput label="Navn" mode="outlined" value={name} onChangeText={setName} />
                        <TextInput label="Adresse" mode="outlined" value={address} onChangeText={setAddress} />
                        <TextInput label="By" mode="outlined" value={city} onChangeText={setCity} />
                        <TextInput label="Telefon" mode="outlined" value={phone} onChangeText={setPhone} />
                        <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} />
                        <Button
                            mode="contained"
                            buttonColor="#be185d"
                            textColor="#ffffff"
                            onPress={handleUpdate}
                            loading={isSaving}
                            disabled={!canSubmit || editingSalonId === null}
                            style={styles.primaryAction}
                        >
                            Gem ændringer
                        </Button>
                        <Button
                            mode="text"
                            textColor="#9d174d"
                            onPress={closeEditModal}
                            disabled={isSaving}
                            style={styles.secondaryAction}
                        >
                            Annuller
                        </Button>
                    </View>
                </Modal>

                <Modal
                    visible={isDeleteModalVisible}
                    onDismiss={closeDeleteModal}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text variant="headlineSmall" style={styles.modalTitleDelete}>Bekræft sletning</Text>
                    <Text variant="bodyMedium" style={styles.modalSubtitle}>
                        Er du sikker på, at du vil slette {deletingSalonName ? `"${deletingSalonName}"` : 'denne salon'}?
                    </Text>
                    <View style={styles.deleteActions}>
                        <Button mode="text" textColor="#9d174d" onPress={closeDeleteModal} disabled={isSaving}>
                            Annuller
                        </Button>
                        <Button
                            mode="contained"
                            buttonColor="#b91c1c"
                            onPress={handleConfirmDelete}
                            loading={isSaving}
                            disabled={isSaving || deletingSalonId === null}
                            style={styles.deleteButton}
                        >
                            Slet
                        </Button>
                    </View>
                </Modal>
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
    form: {
        gap: 12,
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
    modalContainer: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        gap: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    modalTitle: {
        color: '#be185d',
        fontWeight: '700',
    },
    modalTitleDelete: {
        color: '#b91c1c',
        fontWeight: '700',
    },
    modalSubtitle: {
        color: '#52525b',
        opacity: 0.85,
    },
    primaryAction: {
        marginTop: 6,
        borderRadius: 10,
    },
    secondaryAction: {
        marginTop: -4,
    },
    deleteButton: {
        borderRadius: 10,
    },
    deleteActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
