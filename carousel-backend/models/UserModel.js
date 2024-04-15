const { Sequelize } = require("sequelize");
const db = require("../config/db.js");
 
const { DataTypes } = Sequelize;
 
const Users = db.define('users',{
    first_name:{
        type: DataTypes.STRING(70),
        allowNull: false,
    },
    last_name:{
        type: DataTypes.STRING(70),
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING(70),
        allowNull: false,
    },
    slug:{
        type: DataTypes.STRING(70),
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        required: true,
        default: false,
    },
    role:{
        type: DataTypes.ENUM("lender", "borrower", "realtor","attorny","escrow"),
        allowNull: true,
    },
    password:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    buisness_name:{
        type: DataTypes.STRING,
    },
    buisness_address:{
        type: DataTypes.STRING,
    },
    buisness_license:{
        type: DataTypes.STRING,
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    resetToken: { type: DataTypes.STRING },
    resetTokenExpires: { type: DataTypes.DATE },
    passwordReset: { type: DataTypes.DATE },
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
module.exports = Users
// export default Users;