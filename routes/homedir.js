const express = require('express');
const homeDirRouter = express.Router();
const path = require('path');

homeDirRouter.get(/^\/$|^\/index(\.html)?/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

module.exports = homeDirRouter;