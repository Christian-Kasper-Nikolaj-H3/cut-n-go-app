import jwt from 'jsonwebtoken';

import Users from '../models/Users.js';
import UserInformation from "../models/UserInformation.js";
import serverConfig from '../config/Server.js';
import UserRoles from "../models/UserRoles.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, serverConfig.jwtSecret);

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload'
            });
        }

        const user = await Users.findByPk(decoded.userId, {
            attributes: ['id', 'username', 'role_id'],
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
                message: 'User not found'
            });
        }

        req.user = {
            userId: user.id,
            ...user.toJSON()
        };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        console.error('Token verification error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
