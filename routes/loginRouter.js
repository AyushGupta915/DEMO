const express = require('express');
const loginRouter = express.Router();
const { handleLogin } = require('../controllers/authController');

loginRouter.post('/', handleLogin);

module.exports = loginRouter;