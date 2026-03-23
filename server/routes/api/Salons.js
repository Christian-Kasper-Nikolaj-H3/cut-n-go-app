import { Router } from 'express';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Salon from "../../models/Salon.js";

const router = Router();

const salonValidation = [

];

// salon/all
// salon/new
// salon/update/:id
// salon/delete/:id

router.get('/all', authenticateToken, ...salonValidation, handleValidationErrors, async (req, res) => {
    try {
        const salons = await Salon.findAll({});

        return res.status(200).json({
            success: true,
            message: "Salons retrieved successfully",
            data:{
                salons: salons
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

export default router;