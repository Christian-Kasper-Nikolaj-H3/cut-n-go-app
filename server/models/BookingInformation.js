import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const BookingInformation = sequelize.define("BookingInformation", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER(),
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    first_name: {
        type: DataTypes.STRING(),
        allowNull: true,
        validate: {
            notEmpty: { msg: "First name is required" }
        }
    },
    last_name: {
        type: DataTypes.STRING(),
        allowNull: true,
        validate: {
            notEmpty: { msg: "Last name is required" }
        }
    },
    phone: {
        type: DataTypes.STRING(),
        allowNull: true,
        validate: {
            notEmpty: { msg: "Phone number is required" }
        }
    },
    email: {
        type: DataTypes.STRING(),
        allowNull: true,
        validate: {
            notEmpty: { msg: "Email is required" },
            isEmail: { msg: "Invalid email format" }
        }
    }
}, {
    tableName: 'booking_information',
    timestamps: true,
    underscored: true
});

export default BookingInformation;