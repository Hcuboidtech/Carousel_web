const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require('body-parser');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const userRouter = require('./routes/index');
const inviteTeamModel = require("./models/InviteTeamModel.js");
const tokenModel = require("./models/token.js");

const PORT = 3000;
const HOST = 'localhost';
const API_SERVICE_URL = "https://app.getcarouseltech.com";

dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev")); // Logging requests
app.use(cors()); // Allow all origins by default
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/", userRouter);

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to Billing and Account APIs.');
});

// Authorization Middleware
app.use((req, res, next) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.sendStatus(403);
    }
});

// Proxy endpoints
app.use('/', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/': '', // Remove /api prefix
    },
}));

// DB Configuration
inviteTeamModel.sequelize.sync();
tokenModel.sequelize.sync();

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
