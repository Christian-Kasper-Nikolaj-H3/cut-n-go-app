import { BookingScreen } from '@/components/screens/BookingScreen';
import { useAuth } from '@/context/AuthContext';

export default function SharedBookingPage() {
  const { token } = useAuth();

  return <BookingScreen isLoggedIn={!!token} />;
}
