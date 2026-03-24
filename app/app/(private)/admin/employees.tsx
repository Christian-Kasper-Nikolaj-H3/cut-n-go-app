import {useMemo, useState} from "react";
import {FlatList, ScrollView, StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Button, Card, Chip, IconButton, Portal, Snackbar, Text, TextInput} from "react-native-paper";
import {useEmployee} from '@/context/EmployeeContext';
import { useSalon } from '@/context/SalonContext';
import {SalonActionModal} from "@/components/admin/SalonActionModal";
import type {Employee} from "@/api/Employee";
import {Picker} from "@react-native-picker/picker";

type ActiveModal = 'create' | 'edit' | 'delete' | null;

type EmployeeFormState = {
    username: string;
    salon_id: string;
    role_id: string;
};

export default function Employees() {
    const {employees, roles: employeeRoles, createEmployee, updateEmployee, deleteEmployee} = useEmployee();
    const { salons } = useSalon();
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
    const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null);
    const [deletingEmployeeName, setDeletingEmployeeName] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<EmployeeFormState>({
        username: '',
        salon_id: '',
        role_id: '',
    });

    const canSubmit = useMemo(
        () =>
            !!form.username.trim() &&
            !!form.salon_id &&
            !!form.role_id &&
            !isSaving,
        [form, isSaving]
    );

    function resetFormFields() {
        setForm({
            username: '',
            salon_id: '',
            role_id: '',
        });
    }

    function openModal(modal: Exclude<ActiveModal, null>, employee?: Employee) {
        if (modal === 'edit' && employee) {
            setEditingEmployeeId(employee.id);
            setForm({
                username: employee.user?.username ?? '',
                salon_id: String(employee.salon_id ?? employee.salon?.id ?? ''),
                role_id: String(employee.role_id ?? employee.role?.id ?? ''),
            });
        }

        if (modal === 'delete' && employee) {
            setDeletingEmployeeId(employee.id);
            setDeletingEmployeeName(
                `${employee.user?.information?.first_name ?? ''} ${employee.user?.information?.last_name ?? ''}`.trim()
            );
        }

        if (modal === 'create') {
            resetFormFields();
            if (salons.length > 0) {
                setForm((prev) => ({...prev, salon_id: String(salons[0].id)}));
            }
            if (employeeRoles.length > 0) {
                setForm((prev) => ({...prev, role_id: String(employeeRoles[0].id)}));
            }
        }

        setActiveModal(modal);
    }

    function closeModal() {
        setActiveModal(null);
        setEditingEmployeeId(null);
        setDeletingEmployeeId(null);
        setDeletingEmployeeName('');
        resetFormFields();
    }

    async function handleCreate() {
        if (!canSubmit) return;
        setIsSaving(true);
        try {
            await createEmployee({
                role_id: Number(form.role_id),
                salon_id: Number(form.salon_id),
                username: form.username.trim(),
            });
            setMessage('Medarbejder oprettet');
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke oprette medarbejder');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleEdit() {
        if (!canSubmit || editingEmployeeId === null) return;
        setIsSaving(true);
        try {
            await updateEmployee(editingEmployeeId, {
                role_id: Number(form.role_id),
                salon_id: Number(form.salon_id),
            });
            setMessage('Medarbejder opdateret');
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke opdatere medarbejder');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (deletingEmployeeId === null) return;
        setIsSaving(true);
        try {
            await deleteEmployee(deletingEmployeeId);
            setMessage('Medarbejder slettet');
            closeModal();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Kunne ikke slette medarbejder');
        } finally {
            setIsSaving(false);
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
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <Card style={styles.card}>
                        <Card.Title title="Opret medarbejder"/>
                        <Card.Content>
                            <Button mode="contained" icon="plus" onPress={() => openModal('create')}>
                                Ny medarbejder
                            </Button>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>
                                Medarbejdere
                            </Text>
                            <Chip compact style={styles.countChip} textStyle={styles.countChipText}>
                                {employees.length}
                            </Chip>
                        </View>
                        <Card.Content>
                            <FlatList
                                data={employees}
                                keyExtractor={(item) => String(item.id)}
                                scrollEnabled={false}
                                ItemSeparatorComponent={() => <View style={styles.separator}/>}
                                renderItem={({item}) => (
                                    <View style={styles.row}>
                                        <View style={styles.rowInfo}>
                                            <Text variant="titleMedium" style={styles.rowTitle}>
                                                {item.user?.information?.first_name} {item.user?.information?.last_name}
                                            </Text>
                                            <Text variant="bodySmall" style={styles.rowSubtitle}>
                                                {item.salon?.name} · {item.role?.name}
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
                                        Ingen medarbejdere endnu.
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
                    visible={activeModal === 'create'}
                    title="Opret medarbejder"
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
                            label="Username"
                            mode="outlined"
                            value={form.username}
                            onChangeText={(value) => setForm((prev) => ({...prev, username: value}))}
                        />
                        <View style={styles.selectSection}>
                            <Text variant="titleSmall" style={styles.selectTitle}>Salon</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={form.salon_id}
                                    onValueChange={(value) => setForm((prev) => ({...prev, salon_id: String(value)}))}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Vælg salon..." value="" />
                                    {salons.map((salon) => (
                                        <Picker.Item key={salon.id} label={salon.name} value={String(salon.id)} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.selectSection}>
                            <Text variant="titleSmall" style={styles.selectTitle}>Rolle</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={form.role_id}
                                    onValueChange={(value) => setForm((prev) => ({...prev, role_id: String(value)}))}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Vælg rolle..." value="" />
                                    {employeeRoles.map((role) => (
                                        <Picker.Item key={role.id} label={role.name} value={String(role.id)} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </SalonActionModal>

                <SalonActionModal
                    visible={activeModal === 'edit'}
                    title="Rediger medarbejder"
                    subtitle="Opdater oplysningerne og gem dine ændringer."
                    primaryLabel="Gem ændringer"
                    secondaryLabel="Annuller"
                    onPrimaryPress={handleEdit}
                    onSecondaryPress={closeModal}
                    onDismiss={closeModal}
                    primaryLoading={isSaving}
                    primaryDisabled={!canSubmit || editingEmployeeId === null}
                    secondaryDisabled={isSaving}
                >
                    <View style={styles.form}>
                        <TextInput
                            label="Username"
                            mode="outlined"
                            value={form.username}
                            disabled
                        />
                        <View style={styles.selectSection}>
                            <Text variant="titleSmall" style={styles.selectTitle}>Salon</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={form.salon_id}
                                    onValueChange={(value) => setForm((prev) => ({...prev, salon_id: String(value)}))}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Vælg salon..." value="" />
                                    {salons.map((salon) => (
                                        <Picker.Item key={salon.id} label={salon.name} value={String(salon.id)} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.selectSection}>
                            <Text variant="titleSmall" style={styles.selectTitle}>Rolle</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={form.role_id}
                                    onValueChange={(value) => setForm((prev) => ({...prev, role_id: String(value)}))}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Vælg rolle..." value="" />
                                    {employeeRoles.map((role) => (
                                        <Picker.Item key={role.id} label={role.name} value={String(role.id)} />
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
                    primaryDisabled={isSaving || deletingEmployeeId === null}
                    secondaryDisabled={isSaving}
                    variant="danger"
                    subtitle={`Er du sikker på, at du vil slette ${deletingEmployeeName ? `"${deletingEmployeeName}"` : 'denne medarbejder'}?`}
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
        shadowOffset: { width: 0, height: 1 },
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
    modalSubtitle: {
        color: '#52525b',
        opacity: 0.85,
    },
});
