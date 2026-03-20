import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const UserRoles = sequelize.define("UserRoles", {
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
            notEmpty: { msg: "User role name is required" }
        }
    }
}, {
    tableName: 'user_roles',
    timestamps: true,
    underscored: true
});

export default UserRoles;