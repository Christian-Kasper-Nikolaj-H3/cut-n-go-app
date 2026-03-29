import {Text, TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Link} from 'expo-router';
import {useState} from "react";

export default function AboutScreen() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin() {
        console.log(username);
        console.log(password);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>About screen</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Link href={"/register"} style={styles.link}>
                <Text style={styles.linkText}>Don't have an account? Register here</Text>
            </Link>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffe6f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        padding: 20,
        backgroundColor: '#ffd33d',
        borderRadius: 10,
        color: '#fff',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
    },
    button: {
        width: '80%',
        backgroundColor: '#ffd33d',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        padding: 10,
    },
    link: {
        marginTop: 20,
    },
    linkText: {
        color: '#ffd33d',
    }
});