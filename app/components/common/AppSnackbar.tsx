import { Snackbar } from 'react-native-paper';

type AppSnackbarProps = {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onDismiss: () => void;
    duration?: number;
};

export function AppSnackbar({
                                visible,
                                message,
                                type = 'info',
                                onDismiss,
                                duration = 3500,
                            }: AppSnackbarProps) {
    const backgroundColor =
        type === 'success'
            ? '#166534'
            : type === 'error'
                ? '#991b1b'
                : '#1d4ed8';

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={duration}
            style={{ backgroundColor }}
        >
            {message}
        </Snackbar>
    );
}