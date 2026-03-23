import { Router } from 'express';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Employee from "../../models/Employees.js";

const router = Router();

const employeeValidation = [

];

// employee/all
// employee/new

router.get('/all', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const employees = await Employee.findAll({});

        return res.status(200).json({
            success: true,
            message: "Employees retrieved successfully",
            data:{
                employees
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

router.post('/new', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.user;
        const { role_id, salon_id, user_id } = req.body;

        const employee = await Employee.create({
            role_id: role_id,
            salon_id: salon_id,
            user_id: user_id
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: {
                employee
            }
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