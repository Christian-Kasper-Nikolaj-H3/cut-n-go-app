import { Router } from 'express';
import { body, param } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Salon from "../../models/Salon.js";

const router = Router();

const salonBaseValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('name is required')
        .isLength({ min: 2, max: 120 }).withMessage('name must be between 2 and 120 characters'),
    body('address')
        .trim()
        .notEmpty().withMessage('address is required')
        .isLength({ min: 2, max: 255 }).withMessage('address must be between 2 and 255 characters'),
    body('city')
        .trim()
        .notEmpty().withMessage('city is required')
        .isLength({ min: 2, max: 100 }).withMessage('city must be between 2 and 100 characters'),
    body('phone')
        .trim()
        .notEmpty().withMessage('phone is required')
        .isLength({ min: 6, max: 32 }).withMessage('phone must be between 6 and 32 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be valid')
];

const salonIdValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Salon id must be a positive integer')
        .toInt()
];

router.get('/all', authenticateToken, handleValidationErrors, async (req, res) => {
    try {
        const salons = await Salon.findAll({});

        return res.status(200).json({
            success: true,
            message: "Salons retrieved successfully",
            data:{
                salons
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

router.post('/new', authenticateToken, ...salonBaseValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, address, city, phone, email } = req.body;

        const salon = await Salon.create({
            name: name,
            address: address,
            city: city,
            phone: phone,
            email: email
        });

        return res.status(201).json({
            success: true,
            message: "Salon created successfully",
            data: {
                salon
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

router.put('/update/:id', authenticateToken, ...salonIdValidation, ...salonBaseValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const { name, address, city, phone, email } = req.body;

        const salon = await Salon.findByPk(id);
        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        if(name) salon.name = name;
        if(address) salon.address = address;
        if(city) salon.city = city;
        if(phone) salon.phone = phone;
        if(email) salon.email = email;

        await salon.save();

        return res.status(200).json({
            success: true,
            message: "Salon updated successfully",
            data: {
                salon
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

router.delete('/delete/:id', authenticateToken, ...salonIdValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const salon = await Salon.findByPk(id);
        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        await salon.destroy();

        return res.status(200).json({
            success: true,
            message: "Salon deleted successfully"
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;
