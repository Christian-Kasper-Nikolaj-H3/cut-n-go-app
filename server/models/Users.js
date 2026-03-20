import { DataTypes } from "sequelize";
import sequelize from "./Index.js";
import bcrypt from "bcrypt";

const Users = sequelize.define("Users", {
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
            model: 'user_roles',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue("username", value.toLowerCase().trim());
        },
        validate: {
            notEmpty: { msg: "Username is required" },
            is: { args: ["^[a-zA-Z0-9_]+$"], msg: "Username can only contain letters, numbers, and underscores" }
        }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            len: {
                args: [8, 128],
                msg: "Password must be between 8 and 128 characters"
            },
            isStrong(value) {
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
                    throw new Error('Password must contain uppercase, lowercase, and number');
                }
            }
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 12);
        },
        beforeUpdate: async (user) => {
            if(user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        }
    }
});

Users.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default Users;