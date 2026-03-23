import { Router } from 'express';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Bookings from "../../models/Bookings.js";

const router = Router();


router.get('/all', authenticateToken, handleValidationErrors, async (req, res) => {
    try {
        const bookings = await Bookings.findAll({});

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


export default router;
