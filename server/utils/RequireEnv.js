import dotenv from 'dotenv';
dotenv.config();

let CheckRequiredEnvVars = (requiredEnvVars) => {
    requiredEnvVars.forEach(varName => {
        if (process.env[varName] === undefined) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    });
}

export { CheckRequiredEnvVars };