import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const UserInformation = sequelize.define("UserInformation", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    first_name: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "First name is required" }
        },
        set(value) {
            this.setDataValue("first_name", value.trim());
        }
    },
    last_name: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Last name is required" }
        },
        set(value) {
            this.setDataValue("last_name", value.trim());
        }
    },
    phone: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Phone number is required" }
        },
        set(value) {
            this.setDataValue("phone", value.trim());
        }
    },
    email: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Email is required" },
            isEmail: { msg: "Invalid email format" }
        },
        set(value) {
            this.setDataValue("email", value.trim().toLowerCase());
        }
    }
}, {
    tableName: 'user_information',
    timestamps: true
});

export default UserInformation;