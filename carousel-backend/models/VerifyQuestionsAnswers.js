const { Sequelize, INTEGER } = require("sequelize");
const db = require("../config/db.js");
const { DataTypes,sequelize } = Sequelize;


const VerifyQuestionsAnswers = db.define('verify_questions_answers', {
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
  verify_identity_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'verify_identity',
      key: 'id' 
    }
  },
  questions: {
    type: DataTypes.TEXT,
  },
  answers: {
    type: DataTypes.TEXT, // Assuming phone number is a string
  },
},{
  freezeTableName: true
});

(async () => {
    await db.sync();
})();


module.exports = VerifyQuestionsAnswers;
