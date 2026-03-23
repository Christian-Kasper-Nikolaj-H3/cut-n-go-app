import { Router } from 'express';
import { body } from 'express-validator';
import { Op } from 'sequelize';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Bookings from "../../models/Bookings.js";
import BookingInformation from "../../models/BookingInformation.js";
import Users from "../../models/Users.js";
import Employees from "../../models/Employees.js";
import UserInformation from "../../models/UserInformation.js";
import Salon from "../../models/Salon.js";

const router = Router();

// booking/new
// booking/get/all
// booking/available-times

const newBookingValidation = [

];

router.post('/new', authenticateToken, ...newBookingValidation, handleValidationErrors, async (req, res) => {
    try {
        const { salon_id, employee_id, date, first_name, last_name, phone, email } = req.body;
        const { userId } = req.user;

        const booking = await Bookings.create({
            salon_id: salon_id,
            employee_id: employee_id,
            date: date
        });

        const bookingDetails = await BookingInformation.create({
            booking_id: booking.id,
            user_id: userId,
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            email: email
        });

        await booking.reload({
            include: [
                {
                    model: BookingInformation,
                    as: 'information',
                    attributes: ['first_name', 'last_name', 'phone', 'email']
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                booking
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        const bookings = await Bookings.findAll({
            attributes: ['id', 'salon_id', 'date'],
            include: [
                {
                    model: Employees,
                    as: 'employee',
                    attributes: ['id'],
                    include: [
                        {
                            model: Users,
                            as: 'user',
                            attributes: ['id'],
                            include: [
                                {
                                    model: UserInformation,
                                    as: 'information',
                                    attributes: ['first_name', 'last_name']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Salon,
                    as: 'salon',
                    attributes: ['name', 'address', 'city', 'phone', 'email']
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data:{
                bookings: bookings
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get('/available-times', async (req, res) => {
    const { salon_id, date } = req.body;

    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Bookings.findAll({
            where: {
                salon_id: salon_id,
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            },
            attributes: ['date']
        });

        const bookedTimes = bookings.map((booking) => {
            const bookingDate = new Date(booking.date);
            return `${String(bookingDate.getHours()).padStart(2, '0')}:${String(bookingDate.getMinutes()).padStart(2, '0')}`;
        });

        const allTimes = [];
        for (let hour = 9; hour < 17; hour++) {
            allTimes.push(`${String(hour).padStart(2, '0')}:00`);
            allTimes.push(`${String(hour).padStart(2, '0')}:30`);
        }

        const availableTimes = allTimes.filter((time) => !bookedTimes.includes(time));

        return res.status(200).json({
            success: true,
            message: 'Available times retrieved successfully',
            data: {
                availableTimes
            }
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


export default router;
