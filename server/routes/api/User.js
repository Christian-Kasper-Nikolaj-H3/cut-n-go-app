import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

import { authenticateToken } from "../../middlewares/Auth.js"
import { handleValidationErrors } from "../../middlewares/Validation.js";


import Users from "../../models/Users.js";
import UserInformation from "../../models/UserInformation.js";
import UserRoles from "../../models/UserRoles.js"

const router = Router();

const profileValidation = [

];

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
