import { Sequelize } from "sequelize";

import dbConfig from "../config/Database.js";
import serverConfig from "../config/Server.js";

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
        const { default: UserRoles } = await import('./UserRoles.js');
        const { default: EmployeeRoles } = await import('./EmployeeRoles.js');
        const { default: Salon } = await import('./Salon.js');
        const { default: TreatmentCategories } = await import('./TreatmentCategories.js');
        const { default: Treatments } = await import('./Treatments.js');
        const { default: Users } = await import('./Users.js');
        const { default: UserInformation } = await import('./UserInformation.js');
        const { default: Employees } = await import('./Employees.js');

        const roles = await UserRoles.findAll();
        if(roles.length > 0) return;

        await UserRoles.bulkCreate([
            {id: 1, name: 'user'},
            {id: 2, name: 'admin'}
        ]);

        await EmployeeRoles.bulkCreate([
            {id: 1, name: 'employee'},
            {id: 2, name: 'manager'}
        ]);

        await Salon.bulkCreate([
            {id: 1, name: 'Salon Runde Tårn', address: 'Frederiksgade 1', city: 'Aarhus', phone: '123-456-7890', email: 'Cutngo@cutngo.dk'},
            {id: 2, name: 'Salon H.C. Andersens Skæve Hus', address: 'Overgade 24', city: 'Odense', phone: '123-456-7890', email: 'Cutngo@cutngo.dk'},
            {id: 3, name: 'Salon Lille Klippetorv', address: 'Bispensgade 34', city: 'Aalborg', phone: '123-456-7890', email: 'Cutngo@cutngo.dk'},
            {id: 4, name: 'Salon Klippekrogen', address: 'Kongensgade 52', city: 'Esbjerg', phone: '123-456-7890', email: 'Cutngo@cutngo.dk'},
            {id: 5, name: 'Salon Lokkehuset', address: 'Sct. Mathias Gade 45', city: 'Viborg', phone: '123-456-7890', email: 'Cutngo@cutngo.dk'},
            {id: 6, name: 'Salon Frisurevej', address: 'Algade 15', city: 'Roskilde', phone: '123-456-7890', email: 'Cutngo@cutngo.dk'},
        ]);

        await TreatmentCategories.bulkCreate([
            {id: 1, title: 'Klipning', description: 'Herre, dame, barn og pensionist'},
            {id: 2, title: 'Permanent', description: 'Kort, mellem eller langt hår'},
            {id: 3, title: 'Striber', description: 'Kort, mellem, langt eller hætte striber'},
            {id: 4, title: 'Helfarvning', description: 'Kort, mellem eller langt hår'},
            {id: 5, title: 'Toning', description: 'Bund 2-3 cm'},
            {id: 6, title: 'Kombinationer', description: 'Predefinerede combo-behandlinger'},
        ]);

        await Treatments.bulkCreate([
            {id: 1, category_id: 1, name: 'Herre', price: 180},
            {id: 2, category_id: 1, name: 'Dame', price: 250},
            {id: 3, category_id: 1, name: 'Barn', price: 170},
            {id: 4, category_id: 1, name: 'Herre (pensionist)', price: 170},
            {id: 5, category_id: 1, name: 'Dame (pensionist)', price: 230},
            {id: 6, category_id: 2, name: 'Kort', price: 550},
            {id: 7, category_id: 2, name: 'Mellem', price: 750},
            {id: 8, category_id: 2, name: 'Langt', price: 950},
            {id: 9, category_id: 3, name: 'Kort', price: 550},
            {id: 10, category_id: 3, name: 'Mellem', price: 750},
            {id: 11, category_id: 3, name: 'Langt', price: 850},
            {id: 12, category_id: 3, name: 'Hætte Striber', price: 400},
            {id: 13, category_id: 4, name: 'Kort', price: 350},
            {id: 14, category_id: 4, name: 'Mellem', price: 600},
            {id: 15, category_id: 4, name: 'Langt', price: 850},
            {id: 16, category_id: 5, name: 'Bund 2-3cm', price: 350},
            {id: 17, category_id: 6, name: 'Klipning + Permanent', price: 730},
            {id: 18, category_id: 6, name: 'Klipning + Striber', price: 730},
            {id: 19, category_id: 6, name: 'Klipning + Helfarvning', price: 530},
            {id: 20, category_id: 6, name: 'Klipning + Toning', price: 530},
        ]);

        await Users.bulkCreate([
            {id: 1, username: 'Klippet', password: 'Kirsten1234', role_id: 1},
            {id: 2, username: 'Hårdtarbejdende', password: 'Hans1234', role_id: 1},
            {id: 3, username: 'Sakse1', password: 'Søren1234', role_id: 1},
            {id: 4, username: 'Frisure', password: 'Freja1234', role_id: 1},
            {id: 5, username: 'Lokke1', password: 'Lars1234', role_id: 1},
            {id: 6, username: 'Krølle', password: 'Karen1234', role_id: 1},
            {id: 7, username: 'Hårde', password: 'Hanne1234', role_id: 1},
            {id: 8, username: 'Bølle', password: 'Bob1234', role_id: 1},
            {id: 9, username: 'Sakse2', password: 'Sally1234', role_id: 1},
            {id: 10, username: 'Klippe', password: 'Kasper1234', role_id: 1},
            {id: 11, username: 'Lokke2', password: 'Louise1234', role_id: 1},
            {id: 12, username: 'Hår1', password: 'Hilde1234', role_id: 1},
            {id: 13, username: 'Stylet1', password: 'Stine1234', role_id: 1},
            {id: 14, username: 'Bølget', password: 'Benny1234', role_id: 1},
            {id: 15, username: 'Sakse3', password: 'Simone1234', role_id: 1},
            {id: 16, username: 'Klip', password: 'Kim1234', role_id: 1},
            {id: 17, username: 'Lokke3', password: 'Lea1234', role_id: 1},
            {id: 18, username: 'Krøl', password: 'Kalle1234', role_id: 1},
            {id: 19, username: 'Hår2', password: 'Henriette1234', role_id: 1},
            {id: 20, username: 'Stylet2', password: 'Stefan1234', role_id: 1},
            {id: 21, username: 'Kæthe', password: 'Kæthe1234', role_id: 2},
        ],{
            individualHooks: true,
        });

        await UserInformation.bulkCreate([
            {user_id: 1, first_name: "Klippet", last_name: "Kirsten", phone: "12345678", email: "Kirsten@Cutngo.dk"},
            {user_id: 2, first_name: "Hårdtarbejdende", last_name: "Hans", phone: "87654321", email: "Hans@Cutngo.dk"},
            {user_id: 3, first_name: "Sakse", last_name: "Søren", phone: "87654322", email: "Søren@Cutngo.dk"},
            {user_id: 4, first_name: "Frisure", last_name: "Freja", phone: "87654323", email: "Freja@Cutngo.dk"},
            {user_id: 5, first_name: "Lokke", last_name: "Lars", phone: "87654324", email: "Lars@Cutngo.dk"},
            {user_id: 6, first_name: "Krølle", last_name: "Karen", phone: "87654325", email: "Karen@Cutngo.dk"},
            {user_id: 7, first_name: "Hårde", last_name: "Hanne", phone: "87654326", email: "Hanne@Cutngo.dk"},
            {user_id: 8, first_name: "Bølle", last_name: "Bob", phone: "87654327", email: "Bob@Cutngo.dk"},
            {user_id: 9, first_name: "Sakse", last_name: "Sally", phone: "87654328", email: "Sally@Cutngo.dk"},
            {user_id: 10, first_name: "Klippe", last_name: "Kasper", phone: "87654329", email: "Kasper@Cutngo.dk"},
            {user_id: 11, first_name: "Lokke", last_name: "Louise", phone: "87654330", email: "Louise@Cutngo.dk"},
            {user_id: 12, first_name: "Hår", last_name: "Hilde", phone: "87654331", email: "Hilde@Cutngo.dk"},
            {user_id: 13, first_name: "Stylet", last_name: "Stine", phone: "87654332", email: "Stine@Cutngo.dk"},
            {user_id: 14, first_name: "Bølget", last_name: "Benny", phone: "87654333", email: "Benny@Cutngo.dk"},
            {user_id: 15, first_name: "Sakse", last_name: "Simone", phone: "87654334", email: "Simone@Cutngo.dk"},
            {user_id: 16, first_name: "Klip", last_name: "Kim", phone: "87654335", email: "Kim@Cutngo.dk"},
            {user_id: 17, first_name: "Lokke", last_name: "Lea", phone: "87654336", email: "Lea@Cutngo.dk"},
            {user_id: 18, first_name: "Krøl", last_name: "Kalle", phone: "87654337", email: "Kalle@Cutngo.dk"},
            {user_id: 19, first_name: "Hår", last_name: "Henriette", phone: "87654338", email: "Henriette@Cutngo.dk"},
            {user_id: 20, first_name: "Stylet", last_name: "Stefan", phone: "87654339", email: "Stefan@Cutngo.dk"},
            {user_id: 21, first_name: "Kæthe", last_name: "Kæthe", phone: "87654340", email: "Kæthe@Cutngo.dk"},
        ]);

        await Employees.bulkCreate([
            {role_id: 1, salon_id: 1, user_id: 1},
            {role_id: 1, salon_id: 3, user_id: 2},
            {role_id: 1, salon_id: 2, user_id: 3},
            {role_id: 1, salon_id: 4, user_id: 4},
            {role_id: 1, salon_id: 1, user_id: 5},
            {role_id: 1, salon_id: 2, user_id: 6},
            {role_id: 1, salon_id: 6, user_id: 7},
            {role_id: 1, salon_id: 5, user_id: 8},
            {role_id: 1, salon_id: 1, user_id: 9},
            {role_id: 1, salon_id: 3, user_id: 10},
            {role_id: 1, salon_id: 2, user_id: 11},
            {role_id: 1, salon_id: 4, user_id: 12},
            {role_id: 1, salon_id: 2, user_id: 13},
            {role_id: 1, salon_id: 6, user_id: 14},
            {role_id: 1, salon_id: 1, user_id: 15},
            {role_id: 1, salon_id: 3, user_id: 16},
            {role_id: 1, salon_id: 4, user_id: 17},
            {role_id: 1, salon_id: 2, user_id: 18},
            {role_id: 1, salon_id: 1, user_id: 19},
            {role_id: 1, salon_id: 6, user_id: 20},
            {role_id: 2, salon_id: 1, user_id: 21},
        ]);

    } catch (err) {
        console.error('Unable to create dummy data:', err);
    }
}
