import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';

export default function NotFoundScreen() {
  const { token } = useAuth();
  const destination: '/(private)' | '/(auth)/login' = token ? '/(private)' : '/(auth)/login';

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Page not found</Text>
      <Text style={styles.subtitle}>The page you are trying to open does not exist.</Text>
      <Link href={destination} asChild>
        <Button mode="contained">Go back</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
