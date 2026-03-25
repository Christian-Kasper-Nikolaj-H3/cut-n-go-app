import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const BookingTreatments = sequelize.define("BookingTreatments", {
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
    treatment_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'treatments',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: 'booking_treatments',
    timestamps: true,
    underscored: true
});

export default BookingTreatments;
