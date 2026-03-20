import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const Salon = sequelize.define("Salon", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Salon name is required" }
        }
    },
    address: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Salon address is required" }
        }
    },
    city: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Salon city is required" }
        }
    },
    phone: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Salon phone number is required" }
        }
    },
    email: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Salon email is required" },
        }
    }
}, {
    tableName: 'salon',
    timestamps: true,
    underscored: true
});

export default Salon;