import {useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {Text, TextInput, Button, HelperText, Divider} from 'react-native-paper';
import {loginUser} from '@/services/api';
import {useAuth} from '@/context/AuthContext';
import {router} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';

export default function LoginScreen() {
    const {login} = useAuth();
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

    function handleMoveToRegister() {
        router.push('/(auth)/register');
    }

    return (
        <LinearGradient
            colors={['#ffeef8', '#fff0f5', '#ffe6f0']}
            locations={[0, 0.5, 1]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}
        >

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1, justifyContent: 'center', padding: 24}}
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text variant="headlineMedium" style={styles.title}>Welcome back</Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>Sign in to continue</Text>
                    </View>

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
                            Log ind
                        </Button>

                        <Divider
                            style={{
                                marginVertical: 16,
                                backgroundColor: '#be185d',
                                height: 2,
                                opacity: 0.1,
                            }}
                        />

                        <Button mode="text" onPress={handleMoveToRegister}>
                            <Text>Don't have an account? </Text>
                            <Text style={{ color: '#be185d' }}>Register here</Text>
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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
        gap: 4,
        alignItems: 'center',
    },
    title: {
        fontWeight: '700',
        color: '#be185d'
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
        paddingVertical: 6,
        backgroundColor: '#be185d',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex: {
        flex: 1
    }
});