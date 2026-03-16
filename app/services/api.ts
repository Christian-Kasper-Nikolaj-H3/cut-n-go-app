const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function loginUser(username: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.status || 'Login fejlede');
    return data;
}

export async function registerUser(
    username: string,
    name: string,
    surname: string,
    password: string,
    phone: string,
    email: string
) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            name,
            surname,
            password,
            phone,
            email
        }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.status || 'Registrering fejlede');
    return data;
}