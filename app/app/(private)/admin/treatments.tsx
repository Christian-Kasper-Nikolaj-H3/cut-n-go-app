import {useMemo, useState} from "react";
import {FlatList, ScrollView, StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Button, Card, Chip, IconButton, Portal, Snackbar, Text, TextInput} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {SalonActionModal} from "@/components/admin/SalonActionModal";
import {useTreatment} from "@/context/TreatmentContext";
import type {Treatment, TreatmentCategory} from "@/api/Treatment";

type ActiveModal = 'create' | 'edit' | 'delete' | null;
type CategoryModal = 'createCategory' | 'editCategory' | 'deleteCategory' | null;

type TreatmentFormState = {
    name: string;
    price: string;
    category_id: string;
};

export default function AdminTreatmentsScreen() {
    const {treatments, categories, createCategory, updateCategory, deleteCategory, createTreatment, updateTreatment, deleteTreatment} = useTreatment();
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [categoryModal, setCategoryModal] = useState<CategoryModal>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
    const [deletingCategoryTitle, setDeletingCategoryTitle] = useState('');
    const [editingTreatmentId, setEditingTreatmentId] = useState<number | null>(null);
    const [deletingTreatmentId, setDeletingTreatmentId] = useState<number | null>(null);
    const [deletingTreatmentName, setDeletingTreatmentName] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<TreatmentFormState>({
        name: '',
        price: '',
        category_id: '',
    });
    const [categoryTitle, setCategoryTitle] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const canSubmit = useMemo(
        () =>
            !!form.name.trim() &&
            !!form.category_id &&
            !Number.isNaN(Number(form.price)) &&
            Number(form.price) > 0 &&
            !isSaving,
        [form, isSaving]
    );

    function resetFormFields() {
        setForm({
            name: '',
            price: '',
            category_id: '',
        });
    }

    function openModal(modal: Exclude<ActiveModal, null>, treatment?: Treatment) {
        if (modal === 'edit' && treatment) {
            setEditingTreatmentId(treatment.id);
            setForm({
                name: treatment.name ?? '',
                price: String(treatment.price ?? ''),
                category_id: String(treatment.category_id ?? treatment.category?.id ?? ''),
            });
        }

        if (modal === 'delete' && treatment) {
            setDeletingTreatmentId(treatment.id);
            setDeletingTreatmentName(treatment.name);
        }

        if (modal === 'create') {
            resetFormFields();
            if (categories.length > 0) {
                setForm((prev) => ({...prev, category_id: String(categories[0].id)}));
            }
        }

        setActiveModal(modal);
    }

    function closeModal() {
        setActiveModal(null);
        setEditingTreatmentId(null);
        setDeletingTreatmentId(null);
        setDeletingTreatmentName('');
        resetFormFields();
    }

    function closeCategoryModal() {
        setCategoryModal(null);
        setEditingCategoryId(null);
        setDeletingCategoryId(null);
        setDeletingCategoryTitle('');
        setCategoryTitle('');
        setCategoryDescription('');
    }

    function openCategoryModal(modal: Exclude<CategoryModal, null>, category?: TreatmentCategory) {
        if (modal === 'createCategory') {
            setCategoryTitle('');
            setCategoryDescription('');
        }

        if (modal === 'editCategory' && category) {
            setEditingCategoryId(category.id);
            setCategoryTitle(category.title);
            setCategoryDescription(category.description ?? '');
        }

        if (modal === 'deleteCategory' && category) {
            setDeletingCategoryId(category.id);
            setDeletingCategoryTitle(category.title);
        }

        setCategoryModal(modal);
    }

    async function handleCreate() {
        if (!canSubmit) return;
        setIsSaving(true);
        try {
            await createTreatment({
                name: form.name.trim(),
                price: Number(form.price),
                category_id: Number(form.category_id),
            });
            setMessage('Behandling oprettet');
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke oprette behandling');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleEdit() {
        if (!canSubmit || editingTreatmentId === null) return;
        setIsSaving(true);
        try {
            await updateTreatment(editingTreatmentId, {
                name: form.name.trim(),
                price: Number(form.price),
                category_id: Number(form.category_id),
            });
            setMessage('Behandling opdateret');
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke opdatere behandling');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (deletingTreatmentId === null) return;
        setIsSaving(true);
        try {
            await deleteTreatment(deletingTreatmentId);
            setMessage('Behandling slettet');
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke slette behandling');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleCreateCategory() {
        if (!categoryTitle.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const created = await createCategory({
                title: categoryTitle.trim(),
                description: categoryDescription.trim() ? categoryDescription.trim() : null,
            });
            setMessage('Kategori oprettet');
            closeCategoryModal();
            if (!form.category_id) {
                setForm((prev) => ({...prev, category_id: String(created.id)}));
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke oprette kategori');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleEditCategory() {
        if (!categoryTitle.trim() || editingCategoryId === null || isSaving) return;
        setIsSaving(true);
        try {
            await updateCategory(editingCategoryId, {
                title: categoryTitle.trim(),
                description: categoryDescription.trim() ? categoryDescription.trim() : null,
            });
            setMessage('Kategori opdateret');
            closeCategoryModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke opdatere kategori');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteCategory() {
        if (deletingCategoryId === null || isSaving) return;
        setIsSaving(true);
        try {
            await deleteCategory(deletingCategoryId);
            setMessage('Kategori slettet');
            closeCategoryModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke slette kategori');
        } finally {
            setIsSaving(false);
        }
    }

    function formatPrice(price: string) {
        const value = Number(price);
        if (Number.isNaN(value)) return price;
        return `${value.toFixed(2)} kr`;
    }

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <Card style={styles.card}>
                        <Card.Title title="Opret behandlingskategori"/>
                        <Card.Content>
                            <Button mode="contained" icon="shape-plus" onPress={() => openCategoryModal('createCategory')}>
                                Ny kategori
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>
                                Kategorier
                            </Text>
                            <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                                {categories.length}
                            </Chip>
                        </View>
                        <Card.Content>
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => String(item.id)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => <View style={styles.separator}/>}
                                renderItem={({item}) => (
                                    <View style={styles.row}>
                                        <View style={styles.rowInfo}>
                                            <Text variant="titleMedium" style={styles.rowTitle}>
                                                {item.title}
                                            </Text>
                                            {item.description ? (
                                                <Text variant="bodySmall" style={styles.rowSubtitle}>
                                                    {item.description}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <View style={styles.rowActions}>
                                            <IconButton icon="pencil" onPress={() => openCategoryModal('editCategory', item)}/>
                                            <IconButton icon="delete" onPress={() => openCategoryModal('deleteCategory', item)}/>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <Text variant="bodyMedium" style={styles.emptyText}>
                                        Ingen kategorier endnu.
                                    </Text>
                                }
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Title title="Opret behandling"/>
                        <Card.Content>
                            <Button mode="contained" icon="plus" onPress={() => openModal('create')}>
                                Ny behandling
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>
                                Behandlinger
                            </Text>
                            <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                                {treatments.length}
                            </Chip>
                        </View>
                        <Card.Content>
                            <FlatList
                                data={treatments}
                                keyExtractor={(item) => String(item.id)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => <View style={styles.separator}/>}
                                renderItem={({item}) => (
                                    <View style={styles.row}>
                                        <View style={styles.rowInfo}>
                                            <Text variant="titleMedium" style={styles.rowTitle}>
                                                {item.name}
                                            </Text>
                                            <Text variant="bodySmall" style={styles.rowSubtitle}>
                                                {item.category?.title ?? 'Ukendt kategori'} · {formatPrice(item.price)}
                                            </Text>
                                        </View>
                                        <View style={styles.rowActions}>
                                            <IconButton icon="pencil" onPress={() => openModal('edit', item)}/>
                                            <IconButton icon="delete" onPress={() => openModal('delete', item)}/>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <Text variant="bodyMedium" style={styles.emptyText}>
                                        Ingen behandlinger endnu.
                                    </Text>
                                }
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
                    visible={categoryModal === 'createCategory'}
                    title="Opret kategori"
                    primaryLabel="Opret"
                    secondaryLabel="Luk"
                    onPrimaryPress={handleCreateCategory}
                    onSecondaryPress={closeCategoryModal}
                    onDismiss={closeCategoryModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!categoryTitle.trim() || isSaving}
                    secondaryDisabled={isSaving}
                >
                    <View style={styles.form}>
                        <TextInput
                            label="Kategori navn"
                            mode="outlined"
                            value={categoryTitle}
                            onChangeText={setCategoryTitle}
                        />
                        <TextInput
                            label="Beskrivelse (valgfri)"
                            mode="outlined"
                            value={categoryDescription}
                            onChangeText={setCategoryDescription}
                        />
                    </View>
                </SalonActionModal>

                <SalonActionModal
                    visible={categoryModal === 'editCategory'}
                    title="Rediger kategori"
                    primaryLabel="Gem ændringer"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleEditCategory}
                    onSecondaryPress={closeCategoryModal}
                    onDismiss={closeCategoryModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!categoryTitle.trim() || isSaving || editingCategoryId === null}
                    secondaryDisabled={isSaving}
                >
                    <View style={styles.form}>
                        <TextInput
                            label="Kategori navn"
                            mode="outlined"
                            value={categoryTitle}
                            onChangeText={setCategoryTitle}
                        />
                        <TextInput
                            label="Beskrivelse (valgfri)"
                            mode="outlined"
                            value={categoryDescription}
                            onChangeText={setCategoryDescription}
                        />
                    </View>
                </SalonActionModal>

                <SalonActionModal
                    visible={categoryModal === 'deleteCategory'}
                    title="Bekræft sletning"
                    primaryLabel="Slet"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleDeleteCategory}
                    onSecondaryPress={closeCategoryModal}
                    onDismiss={closeCategoryModal}
                    primaryLoading={isSaving}
                    primaryDisabled={isSaving || deletingCategoryId === null}
                    secondaryDisabled={isSaving}
                    variant="danger"
                    subtitle={`Er du sikker på, at du vil slette ${deletingCategoryTitle ? `"${deletingCategoryTitle}"` : 'denne kategori'}?`}
                />

                <SalonActionModal
                    visible={activeModal === 'create'}
                    title="Opret behandling"
                    primaryLabel="Opret"
                    secondaryLabel="Luk"
                    onPrimaryPress={handleCreate}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!canSubmit}
                    secondaryDisabled={isSaving}
                >
                    <View style={styles.form}>
                        <TextInput
                            label="Navn"
                            mode="outlined"
                            value={form.name}
                            onChangeText={(value) => setForm((prev) => ({...prev, name: value}))}
                        />
                        <TextInput
                            label="Pris"
                            mode="outlined"
                            keyboardType="decimal-pad"
                            value={form.price}
                            onChangeText={(value) => setForm((prev) => ({...prev, price: value.replace(',', '.')}))}
                        />
                        <View style={styles.selectSection}>
                            <Text variant="titleSmall" style={styles.selectTitle}>Kategori</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={form.category_id}
                                    onValueChange={(value) => setForm((prev) => ({...prev, category_id: String(value)}))}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Vælg kategori..." value=""/>
                                    {categories.map((category) => (
                                        <Picker.Item key={category.id} label={category.title} value={String(category.id)}/>
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </SalonActionModal>

                <SalonActionModal
                    visible={activeModal === 'edit'}
                    title="Rediger behandling"
                    subtitle="Opdater oplysningerne og gem dine ændringer."
                    primaryLabel="Gem ændringer"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleEdit}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!canSubmit || editingTreatmentId === null}
                    secondaryDisabled={isSaving}
                >
                    <View style={styles.form}>
                        <TextInput
                            label="Navn"
                            mode="outlined"
                            value={form.name}
                            onChangeText={(value) => setForm((prev) => ({...prev, name: value}))}
                        />
                        <TextInput
                            label="Pris"
                            mode="outlined"
                            keyboardType="decimal-pad"
                            value={form.price}
                            onChangeText={(value) => setForm((prev) => ({...prev, price: value.replace(',', '.')}))}
                        />
                        <View style={styles.selectSection}>
                            <Text variant="titleSmall" style={styles.selectTitle}>Kategori</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={form.category_id}
                                    onValueChange={(value) => setForm((prev) => ({...prev, category_id: String(value)}))}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Vælg kategori..." value=""/>
                                    {categories.map((category) => (
                                        <Picker.Item key={category.id} label={category.title} value={String(category.id)}/>
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </SalonActionModal>

                <SalonActionModal
                    visible={activeModal === 'delete'}
                    title="Bekræft sletning"
                    primaryLabel="Slet"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleDelete}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={isSaving || deletingTreatmentId === null}
                    secondaryDisabled={isSaving}
                    variant="danger"
                    subtitle={`Er du sikker på, at du vil slette ${deletingTreatmentName ? `"${deletingTreatmentName}"` : 'denne behandling'}?`}
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
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    form: {
        gap: 12,
    },
    selectSection: {
        gap: 8,
    },
    selectTitle: {
        color: '#9d174d',
        fontWeight: '700',
    },
    pickerWrapper: {
        borderColor: '#f5c2d7',
        borderWidth: 1,
        borderRadius: 14,
        backgroundColor: '#fffafc',
        paddingHorizontal: 12,
        shadowColor: '#ec4899',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
    },
    picker: {
        height: 50,
        color: '#9d174d',
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
});
