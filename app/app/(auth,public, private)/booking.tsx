import { BookingScreen } from '@/components/screens/BookingScreen';
import { useAuth } from '@/context/AuthContext';

export default function SharedBookingPage() {
    const { loggedIn } = useAuth();

    return <BookingScreen isLoggedIn={loggedIn} />;
}