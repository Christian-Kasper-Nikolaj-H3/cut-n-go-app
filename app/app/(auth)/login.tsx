import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { ApiError, AppConfigError } from '@/api/auth';

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof AppConfigError) {
    return 'App config missing: set EXPO_PUBLIC_API_URL.';
  }
  if (error instanceof ApiError) {
    if (error.statusCode === 0) {
      return 'Cannot reach backend. Check URL and server status.';
    }
    if (error.statusCode === 400) {
      return 'Please fill in username and password.';
    }
    if (error.statusCode === 401) {
      return 'Invalid username or password.';
    }
    if (error.statusCode === 404) {
      return 'Auth endpoint not found. Expected /auth/login.';
    }
  }
  return 'Could not sign in right now. Please try again.';
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Please fill in username and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login({
        username: username.trim(),
        password,
      });
    } catch (authError) {
      setError(getLoginErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  }

  function handleMoveToRegister() {
    router.push('/(auth)/register');
  }

  function handleContinueToBooking() {
    router.push('/(public)/booking');
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
        style={{ flex: 1, justifyContent: 'center', padding: 24 }}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome back
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sign in to continue
            </Text>
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

            {error ? <HelperText type="error">{error}</HelperText> : null}

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

            <Divider
              style={{
                marginVertical: 16,
                backgroundColor: '#be185d',
                height: 2,
                opacity: 0.1,
              }}
            />

            <Button mode="text" onPress={handleMoveToRegister}>
              <Text>Don&apos;t have an account? </Text>
              <Text style={{ color: '#be185d' }}>Register here</Text>
            </Button>

            <Button mode="text" onPress={handleContinueToBooking}>
              Continue to booking without login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
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
});
