const { Sequelize, INTEGER } = require("sequelize");
const db = require("../config/db.js");
 
const { DataTypes,sequelize } = Sequelize;
 
const InviteTeam = db.define('invite_team',{
    user_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'users', // <<< Note, its table's name, not object name
            key: 'id' 
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();

module.exports = InviteTeam;
