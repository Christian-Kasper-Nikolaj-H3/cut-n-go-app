import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

type ContactDetailsFormProps = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onChange?: () => void;
};

export function ContactDetailsForm({
                                       firstName,
                                       lastName,
                                       phone,
                                       email,
                                       onFirstNameChange,
                                       onLastNameChange,
                                       onPhoneChange,
                                       onEmailChange,
                                       onChange,
                                   }: ContactDetailsFormProps) {
    return (
        <View style={styles.form}>
            <View style={styles.row}>
                <TextInput
                    label="Fornavn *"
                    value={firstName}
                    onChangeText={(text) => {
                        onFirstNameChange(text);
                        onChange?.();
                    }}
                    mode="outlined"
                    style={styles.flex}
                />
                <TextInput
                    label="Efternavn *"
                    value={lastName}
                    onChangeText={(text) => {
                        onLastNameChange(text);
                        onChange?.();
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
                        onPhoneChange(text);
                        onChange?.();
                    }}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.flex}
                />
                <TextInput
                    label="Email *"
                    value={email}
                    onChangeText={(text) => {
                        onEmailChange(text);
                        onChange?.();
                    }}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.flex}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex: {
        flex: 1,
    },
});