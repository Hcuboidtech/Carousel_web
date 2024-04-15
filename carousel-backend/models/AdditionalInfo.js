const { Sequelize, INTEGER } = require("sequelize");
const db = require("../config/db.js");
 
const { DataTypes,sequelize } = Sequelize;
 
const AdditionalInfo = db.define('additional_info',{
    user_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id' 
        }
    },
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
    },
    slug:{
        type: DataTypes.STRING(70),
    },
    street_address:{
        type: DataTypes.STRING(255),
    },
    city:{
        type: DataTypes.STRING(255),
    },
    state:{
        type: DataTypes.STRING(255),
    },
    zip_code:{
        type: DataTypes.STRING(255),
    },
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();

module.exports = AdditionalInfo;
