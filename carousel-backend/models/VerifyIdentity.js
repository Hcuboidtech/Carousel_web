const { Sequelize, INTEGER } = require("sequelize");
const db = require("../config/db.js");
const { DataTypes,sequelize } = Sequelize;


const VerifyIdentity = db.define('verify_identity', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id' 
    }
  },
  additional_info_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'additional_info',
      key: 'id' 
    }
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  ssn: {
    type: DataTypes.STRING(155),
  },
  phone_number: {
    type: DataTypes.STRING, // Assuming phone number is a string
  },
  email: {
    type: DataTypes.STRING(70),
  },
  userId: {
    type: DataTypes.STRING,
  },
  userToken: {
    type: DataTypes.STRING,
  },
  kbaToken: {
    type: DataTypes.STRING,
  }
},{
  freezeTableName: true
});

(async () => {
    await db.sync();
})();


module.exports = VerifyIdentity;
