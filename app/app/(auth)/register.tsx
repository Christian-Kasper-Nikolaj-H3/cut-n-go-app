import {KeyboardAvoidingView, Platform, StyleSheet, View} from "react-native";
import {Text, TextInput, Button, HelperText, Divider} from 'react-native-paper';
import {useState} from "react";
import {registerUser} from "@/services/api";
import {useAuth} from "@/context/AuthContext";
import {router} from 'expo-router';


export default function RegisterScreen() {
    const [ username, setUsername ] = useState('');
    const [ name, setName ] = useState('');
    const [ surname, setSurname ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ email, setEmail ] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {login} = useAuth();

    async function handleRegister() {
        setLoading(true);
        try {
            const data = await registerUser(
                username,
                name,
                surname,
                password,
                phone,
                email
            );
            await login(data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Noget gik galt');
        } finally {
            setLoading(false);
        }
    }

    function handleMoveToLogin() {
        router.push('/(auth)/login');
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>Join us today</Text>
                </View>

                <View style={styles.form}>
                    {/* 2 kolonner */}
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
                            autoCapitalize="none"
                            style={styles.flex}
                        />
                    </View>

                    {/* 2 kolonner */}
                    <View style={styles.row}>
                        <TextInput
                            label="First name"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            autoCapitalize="none"
                            style={styles.flex}
                        />
                        <TextInput
                            label="Last name"
                            value={surname}
                            onChangeText={setSurname}
                            mode="outlined"
                            autoCapitalize="none"
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

                    {error ? <HelperText type="error" visible>{error}</HelperText> : null}

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
                        <Text style={{ color: '#be185d' }}>Sign in here</Text>
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