import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { loginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!username || !password) {
            setError('Udfyld alle felter');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await loginUser(username, password);
            console.log('Login successful:', data);
            await login(data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Noget gik galt');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>Velkommen tilbage</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>Log ind på din konto</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Brugernavn"
                        value={username}
                        onChangeText={setUsername}
                        mode="outlined"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="account" />}
                    />

                    <TextInput
                        label="Adgangskode"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off' : 'eye'}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    {error ? <HelperText type="error" visible>{error}</HelperText> : null}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        Log ind
                    </Button>

                    <Button mode="text" onPress={() => router.push('/(auth)/register')}>
                        Ingen konto? Opret en her
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    header: {
        padding: 24,
        gap: 4
    },
    title: {
        fontWeight: '700'
    },
    subtitle: {
        opacity: 0.5
    },
    form: {
        padding: 24,
        gap: 12
    },
    button: {
        borderRadius: 10,
        marginTop: 4
    },
    buttonContent: {
        paddingVertical: 6
    },
});