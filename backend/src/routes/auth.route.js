const express = require('express');
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const middleware = require('../middleware/middleware');
const authroute = express.Router();

authroute.post("/register", register);
authroute.post("/login", login);
authroute.post("/logout", logout);
authroute.get("/me", middleware, getMe);

module.exports = authroute;