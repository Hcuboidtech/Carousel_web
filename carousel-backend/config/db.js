// import { Sequelize } from "sequelize";
const {Sequelize} = require('sequelize');

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
// console.log(DB_HOST);
// const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
const db = new Sequelize("carousel", "root", '1', {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases:false,
    synchronize: true,
    autoLoadModels: true,
    logging: false,
});
db.authenticate().then(()=>{
    console.log("db connected...");
}).catch(err=>{
    console.log("error"+err);
})


db.sequelize = db
db.sequelize.sync({force: false}).then(()=>{
    console.log('Yes re-sync done');
})
module.exports = db;
// await db.sync({ force: true }); 
