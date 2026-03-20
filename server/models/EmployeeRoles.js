import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const EmployeeRoles = sequelize.define("EmployeeRoles", {
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
            notEmpty: { msg: "Employee role name is required" }
        }
    }
}, {
    tableName: 'employee_roles',
    timestamps: true,
    underscored: true
});

export default EmployeeRoles;