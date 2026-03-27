import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {Text, TextInput, Button, Divider} from 'react-native-paper';
import {LinearGradient} from 'expo-linear-gradient';
import {useState} from 'react';
import {router} from 'expo-router';
import {useAuth} from '@/context/AuthContext';
import {ApiError, AppConfigError} from '@/api/Auth';
import {AppSnackbar} from '@/components/common/AppSnackbar';

function getRegisterErrorMessage(error: unknown): string {
    if (error instanceof AppConfigError) {
        return 'App config missing: set EXPO_PUBLIC_API_URL.';
    }
    if (error instanceof ApiError) {
        if (error.statusCode === 0) {
            return 'Cannot reach backend. Check URL and server status.';
        }
        if (error.statusCode === 400) {
            return 'Please fill in all required fields.';
        }
        if (error.statusCode === 409) {
            return 'Username is already in use.';
        }
        if (error.statusCode === 404) {
            return 'Auth endpoint not found. Expected /auth/register.';
        }
    }
    return 'Could not create account right now. Please try again.';
}

export default function RegisterScreen() {
    const {register} = useAuth();
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleRegister() {
        if (!username.trim() || !name.trim() || !surname.trim() || !password.trim() || !phone.trim() || !email.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await register({
                username: username.trim(),
                firstName: name.trim(),
                lastName: surname.trim(),
                password,
                phone: phone.trim(),
                email: email.trim(),
            });
        } catch (registerError) {
            setError(getRegisterErrorMessage(registerError));
        } finally {
            setLoading(false);
        }
    }

    function handleMoveToLogin() {
        router.push('/(auth)/login');
    }

    function handleContinueToBooking() {
        router.push('/(public)/booking');
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
                        <Text variant="headlineMedium" style={styles.title}>
                            Create Account
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Join us today
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.row}>
                            <TextInput
                                label="Username"
                                value={username}
                                onChangeText={setUsername}
                                mode="outlined"
                                autoCapitalize="none"
                                style={styles.flex}
                            />
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                autoCapitalize="sentences"
                                keyboardType="email-address"
                                style={styles.flex}
                            />
                        </View>

                        <View style={styles.row}>
                            <TextInput
                                label="First name"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                autoCapitalize="words"
                                style={styles.flex}
                            />
                            <TextInput
                                label="Last name"
                                value={surname}
                                onChangeText={setSurname}
                                mode="outlined"
                                autoCapitalize="words"
                                style={styles.flex}
                            />
                        </View>

                        <View style={styles.row}>
                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                autoCapitalize={"none"}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                                style={styles.flex}
                            />
                            <TextInput
                                label="Phone"
                                value={phone}
                                onChangeText={setPhone}
                                mode="outlined"
                                keyboardType="phone-pad"
                                style={styles.flex}
                            />
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            REGISTER
                        </Button>

                        <Divider
                            style={{
                                marginVertical: 16,
                                backgroundColor: '#be185d',
                                height: 2,
                                opacity: 0.1,
                            }}
                        />

                        <Button mode="text" onPress={handleMoveToLogin}>
                            <Text>Already have an account? </Text>
                            <Text style={{color: '#be185d'}}>Sign in here</Text>
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <AppSnackbar
                visible={!!error}
                message={error}
                type="error"
                onDismiss={() => setError('')}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: '#be185d',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex: {
        flex: 1,
    },
});
