/* import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import db from "./config/db.js";
import router from "./routes/index.js";
*/
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db.js");
const router = require("./routes/index.js");
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
 
app.use(bodyParser.json());
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    const originDomain = req.get('host');
    console.log('Origin Domain:', originDomain);
    next();
});
app.use(router);
 

//------------ DB Configuration ------------//
const inviteTeamModel = require("./models/InviteTeamModel.js");
const tokenModel = require("./models/token.js");
const additionalInfoModel = require("./models/AdditionalInfo.js");
const VerifyIdentity = require("./models/VerifyIdentity.js");
inviteTeamModel.sequelize.sync();
tokenModel.sequelize.sync();
additionalInfoModel.sequelize.sync();
VerifyIdentity.sequelize.sync();

//synchronizing the database and forcing it to false so we dont lose data
/* db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been re sync")
}) */

app.listen(3002, ()=> console.log('Server running at port 3001'));

/* import express from 'express';
import dbConnection from './config/dbConnection.js';
import routes from './routes/index.js';

const app = express();
const port = 3001;

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        message: err.message,
    });
});

// If database is connected successfully, then run the server
dbConnection
    .getConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(`Failed to connect to the database: ${err.message}`);
    });

 */