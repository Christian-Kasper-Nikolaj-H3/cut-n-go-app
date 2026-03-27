import { Router } from 'express';
import { body, query } from 'express-validator';
import { Op } from 'sequelize';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Bookings from "../../models/Bookings.js";
import BookingInformation from "../../models/BookingInformation.js";
import BookingTreatments from "../../models/BookingTreatments.js";
import Users from "../../models/Users.js";
import Employees from "../../models/Employees.js";
import UserInformation from "../../models/UserInformation.js";
import Salon from "../../models/Salon.js";
import Treatments from "../../models/Treatments.js";

const router = Router();

// booking/new
// booking/get/all
// booking/available-times

const newBookingValidation = [
    body('salon_id')
        .isInt({ min: 1 }).withMessage('salon_id must be a positive integer')
        .toInt(),
    body('employee_id')
        .isInt({ min: 1 }).withMessage('employee_id must be a positive integer')
        .toInt(),
    body('date')
        .isISO8601().withMessage('date must be a valid ISO 8601 date')
        .toDate(),
    body('first_name')
        .trim()
        .notEmpty().withMessage('first_name is required')
        .isLength({ min: 2, max: 100 }).withMessage('first_name must be between 2 and 100 characters'),
    body('last_name')
        .trim()
        .notEmpty().withMessage('last_name is required')
        .isLength({ min: 2, max: 100 }).withMessage('last_name must be between 2 and 100 characters'),
    body('phone')
        .trim()
        .notEmpty().withMessage('phone is required')
        .isLength({ min: 6, max: 32 }).withMessage('phone must be between 6 and 32 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be valid'),
    body('treatment_ids')
        .optional()
        .isArray({ min: 1 }).withMessage('treatment_ids must be a non-empty array'),
    body('treatment_ids.*')
        .optional()
        .isInt({ min: 1 }).withMessage('each treatment id must be a positive integer')
        .toInt()
];

const availableTimesValidation = [
    query('salon_id')
        .isInt({ min: 1 }).withMessage('salon_id must be a positive integer')
        .toInt(),
    query('employee_id')
        .isInt({ min: 1 }).withMessage('employee_id must be a positive integer')
        .toInt(),
    query('date')
        .isISO8601().withMessage('date must be a valid ISO 8601 date')
];

router.post('/new', ...newBookingValidation, handleValidationErrors, async (req, res) => {
    try {
        const { salon_id, employee_id, date, first_name, last_name, phone, email, treatment_ids } = req.body;


        const booking = await Bookings.create({
            salon_id: salon_id,
            employee_id: employee_id,
            date: date
        });

        const bookingDetails = await BookingInformation.create({
            booking_id: booking.id,
            user_id: req?.user?.userId ?? null,
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            email: email
        });

        if (Array.isArray(treatment_ids) && treatment_ids.length > 0) {
            const uniqueTreatmentIds = [...new Set(treatment_ids)];

            const existingTreatments = await Treatments.findAll({
                where: { id: uniqueTreatmentIds },
                attributes: ['id']
            });
            if (existingTreatments.length !== uniqueTreatmentIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more treatments were not found"
                });
            }

            await BookingTreatments.bulkCreate(
                uniqueTreatmentIds.map((treatmentId) => ({
                    booking_id: booking.id,
                    treatment_id: treatmentId
                }))
            );
        }

        await booking.reload({
            include: [
                {
                    model: BookingInformation,
                    as: 'information',
                    attributes: ['first_name', 'last_name', 'phone', 'email']
                },
                {
                    model: Treatments,
                    as: 'treatments',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'price']
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

router.get('/all', handleValidationErrors, async (req, res) => {
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
                },
                {
                    model: Treatments,
                    as: 'treatments',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'price']
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

router.get('/available-times', ...availableTimesValidation, handleValidationErrors, async (req, res) => {
    const { salon_id, employee_id, date } = req.query;

    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Bookings.findAll({
            where: {
                salon_id: salon_id,
                employee_id: employee_id,
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
