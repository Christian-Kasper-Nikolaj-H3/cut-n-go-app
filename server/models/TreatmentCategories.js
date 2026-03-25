import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const TreatmentCategories = sequelize.define("TreatmentCategories", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Category title is required" }
        }
    },
    description: {
        type: DataTypes.TEXT(),
        allowNull: true
    }
}, {
    tableName: 'treatment_categories',
    timestamps: true,
    underscored: true
});

export default TreatmentCategories;