const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getAvailableBookingTimes(salonID: string, date: string) {
    const res = await fetch(
        `${BASE_URL}/api/booking/available-times?salonID=${encodeURIComponent(salonID)}&date=${encodeURIComponent(date)}`
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.status || 'Kunne ikke hente ledige tider');
    }

    return data;
}

export async function createBooking(payload: {
    SalonID: string;
    KundeFornavn: string;
    KundeEfternavn: string;
    KundeTelefon: string;
    KundeEmail: string;
    BestillingDato: string;
}) {
    const res = await fetch(`${BASE_URL}/api/booking/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        if (data.errors) {
            const errorMessages = Object.values(data.errors).join(', ');
            throw new Error(`Fejl: ${errorMessages}`);
        }

        throw new Error(data.status || 'Der opstod en fejl');
    }

    return data;
}