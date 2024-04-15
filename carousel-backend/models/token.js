const { Sequelize } = require("sequelize");
const db = require("../config/db.js");
 
const { DataTypes } = Sequelize;

const Token = db.define('token',{
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onUpdate: "cascade",
            onDelete: "cascade",
            references: { model: "users", key: "id" }
          },
        token: {
            type: DataTypes.STRING,
            
        },
    }, {timestamps: true,freezeTableName:true});
 
(async () => {
    await db.sync();
})();
 
module.exports = Token