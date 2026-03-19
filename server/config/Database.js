import { CheckRequiredEnvVars } from '../utils/RequireEnv.js';

CheckRequiredEnvVars([
    'DB_USER',
    'DB_PASS',
    'DB_NAME',
    'DB_HOST',
    'DB_DIALECT'
]);

export default {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
};