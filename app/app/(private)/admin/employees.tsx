import {FlatList, ScrollView, StyleSheet, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Button, Card, Chip, IconButton, Text} from "react-native-paper";
import { useAdmin } from '@/context/AdminContext';

export default function Employees() {
    const { employees } = useAdmin();

    function handleEdit() {

    }

    function handleDelete() {

    }

    function openModal() {

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
                        <Card.Title title="Opret medarbejder" />
                        <Card.Content>
                            <Button mode="contained" icon="plus" onPress={openModal}>
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
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                renderItem={({item}) => (
                                    <View style={styles.row}>
                                        <View style={styles.rowInfo}>
                                            <Text variant="titleMedium" style={styles.rowTitle}>
                                                {item.user.information.first_name} {item.user.information.last_name}
                                            </Text>
                                            <Text variant="bodySmall" style={styles.rowSubtitle}>
                                                {item.salon.name} - {item.role.name}
                                            </Text>
                                        </View>
                                        <View style={styles.rowActions}>
                                            <IconButton icon="pencil" onPress={handleEdit} />
                                            <IconButton icon="delete" onPress={handleDelete} />
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
