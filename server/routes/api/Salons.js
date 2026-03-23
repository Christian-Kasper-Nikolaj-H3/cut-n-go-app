import { Router } from 'express';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Salon from "../../models/Salon.js";

const router = Router();

const salonValidation = [

];

router.get('/all', authenticateToken, ...salonValidation, handleValidationErrors, async (req, res) => {
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

router.post('/new', authenticateToken, ...salonValidation, handleValidationErrors, async (req, res) => {
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

router.put('/update/:id', authenticateToken, ...salonValidation, handleValidationErrors, async (req, res) => {
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

router.delete('/delete/:id', authenticateToken, ...salonValidation, handleValidationErrors, async (req, res) => {
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
})

export default router;