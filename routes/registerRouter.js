const express = require('express');
const registerRouter = express.Router();
const path = require('path');
const {handleNewUser} = require('../controllers/registerController');

registerRouter.post('/', handleNewUser);

module.exports = registerRouter;