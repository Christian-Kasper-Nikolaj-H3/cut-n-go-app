import { Sequelize } from "sequelize";

import dbConfig from "../config/Database.js";
import serverConfig from "../config/Server.js";
import UserRoles from "./UserRoles";
import EmployeeRoles from "./EmployeeRoles";

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000
        },
        logging: serverConfig.env === "development" ? (msg) => {
            const filtered = msg.replace(/password\s*=\s*'[^']*'/gi, "password='***'");
            console.log(filtered);
        } : false,
        retry: {
            max: 3,
            match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/
            ]
        }
    }
);

export default sequelize;

export async function initializeDatabase() {
    const setupAssociations = (await import('./Associations.js')).default;

    try {
        setupAssociations();
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connection established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }

    try {
        await UserRoles.bulkCreate([
            {name: 'user'},
            {name: 'admin'}
        ]);

        await EmployeeRoles.bulkCreate([
            {name: 'employee'},
            {name: 'manager'}
        ]);
    } catch (err) {

    }
}