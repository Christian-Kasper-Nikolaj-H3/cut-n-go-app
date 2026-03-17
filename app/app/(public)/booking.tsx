import {Button, Text} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import {router} from 'expo-router';

export default function BookingScreen() {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Booking page</Text>
            <Button mode="contained" onPress={() => router.push('/(auth)/login')}>
                Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
});
