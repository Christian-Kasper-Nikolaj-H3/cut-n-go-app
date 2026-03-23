import { Router } from 'express';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";

import Employee from "../../models/Employees.js";
import Users from "../../models/Users.js";
import UserInformation from "../../models/UserInformation.js";
import Salon from "../../models/Salon.js";
import EmployeeRoles from "../../models/EmployeeRoles.js";

const router = Router();

const employeeValidation = [

];

// employee/all
// employee/new

router.get('/all', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'username'],
                    include: [
                        {
                            model: UserInformation,
                            as: 'information',
                            attributes: ['first_name', 'last_name', 'phone', 'email']
                        }
                    ]
                },
                {
                    model: Salon,
                    as: 'salon',
                    attributes: ['id', 'name', 'address', 'city', 'phone', 'email']
                },
                {
                    model: EmployeeRoles,
                    as: 'role',
                    attributes: ['name']
                }
            ]
        });

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
        const { role_id, salon_id, user_id } = req.body;

        const employee = await Employee.create({
            role_id: role_id,
            salon_id: salon_id,
            user_id: user_id
        });

        await employee.reload({
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['id', 'username'],
                    include: [
                        {
                            model: UserInformation,
                            as: 'information',
                            attributes: ['first_name', 'last_name', 'phone', 'email']
                        }
                    ]
                },
                {
                    model: Salon,
                    as: 'salon',
                    attributes: ['id', 'name', 'address', 'city', 'phone', 'email']
                }
            ]
        })

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
