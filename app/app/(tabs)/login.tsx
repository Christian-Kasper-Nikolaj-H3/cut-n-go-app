import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import { loginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginTabScreen() {
    const { login, token, logout } = useAuth();
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
            await login(data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Noget gik galt');
        } finally {
            setLoading(false);
        }
    }

    function handleMoveToRegister() {
        router.push('/(auth)/register');
    }

    async function handleLogout() {
        await logout();
    }

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboard}
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text variant="headlineMedium" style={styles.title}>
                            {token ? 'Du er logget ind' : 'Welcome back'}
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            {token ? 'Du kan logge ud herfra' : 'Sign in to continue'}
                        </Text>
                    </View>

                    {token ? (
                        <View style={styles.form}>
                            <Button
                                mode="contained"
                                onPress={handleLogout}
                                style={styles.button}
                                contentStyle={styles.buttonContent}
                            >
                                LOG OUT
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.form}>
                            <TextInput
                                label="Username"
                                value={username}
                                onChangeText={setUsername}
                                mode="outlined"
                                autoCapitalize="none"
                            />

                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
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
                                SIGN IN
                            </Button>

                            <Divider style={styles.divider} />

                            <Button mode="text" onPress={handleMoveToRegister}>
                                <Text>Don't have an account? </Text>
                                <Text style={styles.linkText}>Register here</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboard: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    header: {
        padding: 24,
        gap: 4,
        alignItems: 'center',
    },
    title: {
        fontWeight: '700',
        color: '#be185d',
        textAlign: 'center',
    },
    subtitle: {
        opacity: 0.5,
        textAlign: 'center',
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
        backgroundColor: '#be185d',
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#be185d',
        height: 2,
        opacity: 0.1,
    },
    linkText: {
        color: '#be185d',
    },
});