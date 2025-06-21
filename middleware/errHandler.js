const {logEvents} = require('./logEvents');

const errHandler = async (err, req, res, next) => {
    await logEvents(`${err.name}\t${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
};

module.exports = errHandler