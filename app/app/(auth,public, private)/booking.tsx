import {useState} from 'react';
import {SalonPicker} from '@/components/booking/SalonPicker';
import {EmployeePicker} from '@/components/booking/EmployeePicker';
import {BookingFormStep} from '@/components/booking/BookingFormStep';
import {type Salon} from '@/api/Salon';
import {type Employee} from '@/api/Employee';

type BookingStep = 'salon' | 'employee' | 'booking';

export default function SharedBookingPage() {
    const [step, setStep] = useState<BookingStep>('salon');
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    function handleSelectSalon(salon: Salon) {
        setSelectedSalon(salon);
        setSelectedEmployee(null);
        setStep('employee');
    }

    function handleSelectEmployee(employee: Employee) {
        setSelectedEmployee(employee);
        setStep('booking');
    }

    function handleBackToSalon() {
        setSelectedEmployee(null);
        setStep('salon');
    }

    function handleBackToEmployee() {
        setStep('employee');
    }

    if (step === 'salon') {
        return <SalonPicker onSelectSalon={handleSelectSalon} />;
    }

    if (step === 'employee') {
        if (!selectedSalon) {
            return <SalonPicker onSelectSalon={handleSelectSalon} />;
        }

        return (
            <EmployeePicker
                salonId={selectedSalon.id}
                salonName={selectedSalon.name}
                onBack={handleBackToSalon}
                onSelectEmployee={handleSelectEmployee}
            />
        );
    }

    return (
        <BookingFormStep
            salon={selectedSalon}
            employee={selectedEmployee}
            onBack={handleBackToEmployee}
        />
    );
}