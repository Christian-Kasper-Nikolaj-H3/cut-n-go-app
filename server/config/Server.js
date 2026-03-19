import { CheckRequiredEnvVars } from '../utils/RequireEnv.js';

CheckRequiredEnvVars([
    'NODE_ENV',
    'LISTENING_PORT',
    'LISTENING_HOST',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
]);

export default {
    env: process.env.NODE_ENV,
    port: process.env.LISTENING_PORT,
    host: process.env.LISTENING_HOST,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
}