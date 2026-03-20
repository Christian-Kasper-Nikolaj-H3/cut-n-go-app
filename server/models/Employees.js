import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const Employees = sequelize.define("Employees", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'employee_roles',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    user_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: 'employees',
    timestamps: true,
    underscored: true
});

export default Employees;