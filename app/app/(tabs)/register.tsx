
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from "react-native";
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import {useState} from "react";
import { router } from "expo-router";


export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleRegister() {
        setLoading(true);
        console.log("pressed");
    }

    function handleMoveToLogin() {
        console.log("pressed");
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView keyboardShouldPersistTaps={"handled"}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text variant={"headlineMedium"} style={styles.title}>
                            Opret konto
                        </Text>
                        <Text variant={"bodyMedium"} style={styles.subtitle}>
                            Udfyld dine oplysninger nedenfor
                        </Text>
                    </View>

                    <Divider />

                    <View style={styles.form}>
                        <TextInput
                            label={"Email"}
                            value={email}
                            onChangeText={setEmail}
                            mode={"outlined"}
                            keyboardType={"email-address"}
                            autoCapitalize={"none"}
                            left={<TextInput.Icon icon={"email"} />}
                        />

                        <TextInput
                            label={"Adgangskode"}
                            value={password}
                            onChangeText={setPassword}
                            mode={"outlined"}
                            secureTextEntry={!showPassword}
                            left={<TextInput.Icon icon={"lock"} />}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />

                        <Button
                            mode={"contained"}
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            Opret konto
                        </Button>

                        <Button mode={"text"} onPress={handleMoveToLogin}>
                            Har du allerede en konto? Log ind
                        </Button>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        padding: 15,
        gap: 15,
    },
    header: {
        padding: 24,
        gap: 4,
    },
    title: {
        fontWeight: '700',
    },
    subtitle: {
        opacity: 0.5,
    },
    form: {
        padding: 24,
        gap: 12,
    },
    button: {
        borderRadius: 10,
        marginTop: 4,
    },
    buttonContent: {
        paddingVertical: 6,
    },
});