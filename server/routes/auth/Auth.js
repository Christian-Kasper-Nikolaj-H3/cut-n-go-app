import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

import sequelize from "../../models/Index.js";
import serverConfig from "../../config/Server.js";
import { handleValidationErrors } from "../../middlewares/Validation.js";
import Users from "../../models/Users.js";
import UserInformation from "../../models/UserInformation.js";
import UserRoles from "../../models/UserRoles.js";

const router = Router();

const loginValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage("Username is required"),

    body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
];

const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage("Username is required")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    body('firstName')
        .trim()
        .notEmpty().withMessage("First name is required"),

    body('lastName')
        .trim()
        .notEmpty().withMessage("Last name is required"),

    body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8, max: 128 }).withMessage("Password must be between 8 and 128 characters")
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).withMessage("Password must contain uppercase, lowercase, and number"),

    body('phone')
        .trim()
        .notEmpty().withMessage("Phone number is required"),

    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
];

const generateToken = (userId) => {
    if (!userId) {
        throw new Error("User ID is required for token generation");
    }

    return jwt.sign(
        { userId },
        serverConfig.jwtSecret,
        { expiresIn: serverConfig.jwtExpiresIn }
    );
}

router.post('/login', ...loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({
            where: { username },
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
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const validPassword = await user.validatePassword(password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = generateToken(user.id);
        const { password: _, ...userWithoutPassword } = user.toJSON();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: userWithoutPassword,
            }
        });
    } catch (err) {
        console.error(err);

        switch(err.name) {
            case 'SequelizeValidationError':
                return res.status(400).json({
                    success: false,
                    message: err.errors.map(error => error.message).join(', ')
                });
            case 'SequelizeUniqueConstraintError':
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            default:
                return res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
        }
    }
});

router.post('/register', ...registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const { username, firstName, lastName, password, phone, email } = req.body;

        const doesUserExist = await Users.findOne({
            where: { username }
        });
        if (doesUserExist) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        const result = await sequelize.transaction(async (t) => {
            const userRole = await UserRoles.findOne({
                where: { name: 'user' },
                transaction: t
            })

            const user = await Users.create({
                role_id: userRole.id,
                username,
                password
            }, { transaction: t });

            const userInformation = await UserInformation.create({
                user_id: user.id,
                first_name: firstName,
                last_name: lastName,
                phone,
                email
            }, { transaction: t });

            await user.reload({
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
                ],
                transaction: t
            });

            const { password: _, ...userWithoutPassword } = user.toJSON();

            return {
                user: userWithoutPassword
            }
        });

        const token = generateToken(result.user.id);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                token,
                user: result.user
            }
        });
    } catch (err) {
        console.error(err);

        switch(err.name) {
            case 'SequelizeValidationError':
                return res.status(400).json({
                    success: false,
                    message: err.errors.map(error => error.message).join(', ')
                });
            case 'SequelizeUniqueConstraintError':
                return res.status(400).json({
                    success: false,
                    message: "Username already exists"
                });
            default:
                return res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
        }
    }
});

export default router;
