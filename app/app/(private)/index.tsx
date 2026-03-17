import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Index() {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>You are logged in.</Text>
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
