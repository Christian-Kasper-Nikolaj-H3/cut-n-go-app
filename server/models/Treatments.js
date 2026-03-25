import { DataTypes } from "sequelize";
import sequelize from "./Index.js";

const Treatments = sequelize.define("Treatments", {
    id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'treatment_categories',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Treatment name is required" }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            notEmpty: { msg: "Treatment price is required" }
        }
    }
}, {
    tableName: 'treatments',
    timestamps: true,
    underscored: true
});

export default Treatments;