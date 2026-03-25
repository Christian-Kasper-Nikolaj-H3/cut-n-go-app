import { Router } from 'express';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";


import Users from "../../models/Users.js";
import UserInformation from "../../models/UserInformation.js";
import UserRoles from "../../models/UserRoles.js"
import Bookings from "../../models/Bookings.js";
import Salon from "../../models/Salon.js";
import Employees from "../../models/Employees.js";
import BookingInformation from "../../models/BookingInformation.js";
import Treatments from "../../models/Treatments.js";

const router = Router();

const profileValidation = [
    body().custom((_, { req }) => {
        if (!req.user?.userId || !Number.isInteger(req.user.userId)) {
            throw new Error('Invalid token payload');
        }
        return true;
    })
];

router.get('/bookings', authenticateToken, ...profileValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        const bookings = await Bookings.findAll({
            include: [
                {
                    model: BookingInformation,
                    as: 'information',
                    attributes: ['first_name', 'last_name', 'phone', 'email'],
                    where: { user_id: userId }
                },
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
            ],
            order: [['date', 'DESC']]
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
})

router.get('/me', authenticateToken, ...profileValidation, handleValidationErrors, async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await Users.findByPk(userId, {
            include: [
                {
                    model: UserInformation,
                    as: 'information',
                    attributes: ['first_name', 'last_name', 'phone', 'email']
                },
                {
                    model: UserRoles,
                    as: 'role',
                    attributes: ['name']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const adminRole = await UserRoles.findOne({
            where: { name: 'admin' }
        });
        if (!adminRole) {
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: {
                id: user.id,
                username: user.username,
                is_admin: user.role_id === adminRole.id,
                first_name: user.information.first_name,
                last_name: user.information.last_name,
                phone: user.information.phone,
                email: user.information.email
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
