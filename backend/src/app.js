const express = require('express');
const authroute = require('./routes/auth.route');
const postroute = require('./routes/user.route');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use('/api/auth', authroute);
app.use('/api/post', postroute);

module.exports = app;