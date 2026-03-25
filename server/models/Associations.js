import UserRoles from "./UserRoles.js";
import Users from "./Users.js";
import UserInformation from "./UserInformation.js";
import EmployeeRoles from "./EmployeeRoles.js";
import Employees from "./Employees.js";
import Salon from "./Salon.js";
import Bookings from "./Bookings.js";
import BookingInformation from "./BookingInformation.js";
import Treatments from "./Treatments.js";
import TreatmentCategories from "./TreatmentCategories.js";
import BookingTreatments from "./BookingTreatments.js";

export default function setupAssociations() {
    UserRoles.hasMany(Users, { foreignKey: "role_id", as: "users" });
    Users.belongsTo(UserRoles, { foreignKey: "role_id", as: "role" });

    Users.hasOne(UserInformation, { foreignKey: "user_id", as: "information" });
    UserInformation.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    EmployeeRoles.hasMany(Employees, { foreignKey: "role_id", as: "employees" });
    Employees.belongsTo(EmployeeRoles, { foreignKey: "role_id", as: "role" });

    Salon.hasMany(Employees, { foreignKey: "salon_id", as: "employees" });
    Employees.belongsTo(Salon, { foreignKey: "salon_id", as: "salon" });

    Users.hasOne(Employees, { foreignKey: "user_id", as: "employeeProfile" });
    Employees.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    Salon.hasMany(Bookings, { foreignKey: "salon_id", as: "bookings" });
    Bookings.belongsTo(Salon, { foreignKey: "salon_id", as: "salon" });

    Employees.hasMany(Bookings, { foreignKey: "employee_id", as: "bookings" });
    Bookings.belongsTo(Employees, { foreignKey: "employee_id", as: "employee" });

    Bookings.hasOne(BookingInformation, { foreignKey: "booking_id", as: "information" });
    BookingInformation.belongsTo(Bookings, { foreignKey: "booking_id", as: "booking" });

    Users.hasMany(BookingInformation, { foreignKey: "user_id", as: "bookingInformation" });
    BookingInformation.belongsTo(Users, { foreignKey: "user_id", as: "user" });

    TreatmentCategories.hasMany(Treatments, { foreignKey: "category_id", as: "treatments" });
    Treatments.belongsTo(TreatmentCategories, { foreignKey: "category_id", as: "category" });

    Bookings.hasMany(BookingTreatments, { foreignKey: "booking_id", as: "bookingTreatments" });
    BookingTreatments.belongsTo(Bookings, { foreignKey: "booking_id", as: "booking" });

    Treatments.hasMany(BookingTreatments, { foreignKey: "treatment_id", as: "bookingTreatments" });
    BookingTreatments.belongsTo(Treatments, { foreignKey: "treatment_id", as: "treatment" });

    Bookings.belongsToMany(Treatments, {
        through: BookingTreatments,
        foreignKey: "booking_id",
        otherKey: "treatment_id",
        as: "treatments"
    });
    Treatments.belongsToMany(Bookings, {
        through: BookingTreatments,
        foreignKey: "treatment_id",
        otherKey: "booking_id",
        as: "bookings"
    });
}
