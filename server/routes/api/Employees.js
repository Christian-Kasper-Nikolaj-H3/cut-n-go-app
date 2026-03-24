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
// employee/all/:salonId
// employee/new

router.get('/roles', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const employeeRoles = await EmployeeRoles.findAll({
            attributes: ['id', 'name']
        });

        return res.status(200).json({
            success: true,
            message: "Employee roles retrieved successfully",
            data:{
                roles: employeeRoles
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

router.get('/all/:salonId', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const { salonId } = req.params;
        const employees = await Employee.findAll({
            where: {
                salon_id: salonId,
            },
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
        const { role_id, salon_id, username } = req.body;

        const user = await Users.findOne({
            where: { username: username }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isAlreadyEmployee = await Employee.findOne({
            where: { user_id: user.id }
        });
        if (isAlreadyEmployee) {
            return res.status(400).json({
                success: false,
                message: "User is already an employee"
            });
        }

        const employee = await Employee.create({
            role_id: role_id,
            salon_id: salon_id,
            user_id: user.id
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
                },
                {
                    model: EmployeeRoles,
                    as: 'role',
                    attributes: ['name']
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
});
});

router.put('/update/:id', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const { role_id, salon_id, user_id } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        if(role_id) employee.role_id = role_id;
        if(salon_id) employee.salon_id = salon_id;
        if(user_id) employee.user_id = user_id;

        await employee.save();

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
            message: "Employee updated successfully",
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
});

router.delete('/delete/:id', authenticateToken, ...employeeValidation, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        await employee.destroy();

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
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
