const express = require('express');
const refreshRouter = express.Router();
const { handleRefreshToken } = require('../controllers/refreshController');

refreshRouter.get('/', handleRefreshToken);

module.exports = refreshRouter;
