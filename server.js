const express = require('express');
const app = express();
const errHandler = require('./middleware/errHandler');
const path = require('path');
const PORT = process.env.PORT || 3000;
const homeDirRouter = require('./routes/homedir');
const employeeRouter = require('./routes/api/employeeRouter')
const registerRouter = require('./routes/registerRouter');  
const loginRouter = require('./routes/loginRouter');
const refreshRouter = require('./routes/refreshRouter');
const logoutRouter = require('./routes/logoutRouter');
const credential = require('./middleware/credentials');
const verifyJwt = require('./middleware/verifyJwt');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');

const {logger} = require('./middleware/logEvents');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

const cors = require('cors');
const corsOption = require('./config/corsOption');
app.use(cors(corsOption));


app.use(logger);
app.use('/', credential)

app.use('/', homeDirRouter)
app.use('/register', registerRouter);
app.use('/auth', loginRouter);

connectDB();
app.use('/api/employee', verifyJwt, employeeRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

app.all(/^\/.*/, (req, res) => {
  res.status(404)
  if(req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  }
  else if(req.accepts('json')) {
    res.json({ "message": "404 Not Found" });
  }
  else {
    res.type('txt').send('404 Not Found');
  }
})

app.use(errHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
