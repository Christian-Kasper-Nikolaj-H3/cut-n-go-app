import {StyleSheet, View} from 'react-native';
import {Button, Modal, Text} from 'react-native-paper';

type SalonActionModalProps = {
    visible: boolean;
    title: string;
    subtitle?: string;
    primaryLabel: string;
    secondaryLabel: string;
    onPrimaryPress: () => void;
    onSecondaryPress: () => void;
    onDismiss: () => void;
    primaryLoading?: boolean;
    primaryDisabled?: boolean;
    secondaryDisabled?: boolean;
    variant?: 'default' | 'danger';
    children?: React.ReactNode;
};

export function SalonActionModal({
    visible,
    title,
    subtitle,
    primaryLabel,
    secondaryLabel,
    onPrimaryPress,
    onSecondaryPress,
    onDismiss,
    primaryLoading = false,
    primaryDisabled = false,
    secondaryDisabled = false,
    variant = 'default',
    children,
}: SalonActionModalProps) {
    const isDanger = variant === 'danger';

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
            <Text variant="headlineSmall" style={isDanger ? styles.modalTitleDelete : styles.modalTitle}>
                {title}
            </Text>
            {subtitle ? <Text variant="bodyMedium" style={styles.modalSubtitle}>{subtitle}</Text> : null}
            {children}
            <View style={styles.actions}>
                <Button mode="text" textColor="#9d174d" onPress={onSecondaryPress} disabled={secondaryDisabled}>
                    {secondaryLabel}
                </Button>
                <Button
                    mode="contained"
                    buttonColor={isDanger ? '#b91c1c' : '#be185d'}
                    textColor="#ffffff"
                    onPress={onPrimaryPress}
                    loading={primaryLoading}
                    disabled={primaryDisabled}
                    style={styles.primaryButton}
                >
                    {primaryLabel}
                </Button>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        gap: 12,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
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
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    primaryButton: {
        borderRadius: 10,
    },
});
