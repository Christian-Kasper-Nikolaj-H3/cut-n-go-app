import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const Bookings = sequelize.define("Bookings", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    salon_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'salon',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    employee_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'employees',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    date: {
        type: DataTypes.DATE(),
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            notEmpty: { msg: "Booking date is required" },
            isDate: true,
            isAfter: { args: [new Date()], msg: "Booking date must be in the future" }
        }
    }
}, {
    tableName: 'bookings',
    timestamps: true,
    underscored: true
});

export default Bookings;