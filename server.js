// https://www.youtube.com/watch?v=jivyItmsu18&list=PL0Zuz27SZ-6P4vnjQ_PJ5iRYsqJkQhtUu
// https://expressjs.com/en/guide/migrating-5.html#path-syntax

require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const {logger} = require('./middleware/logEvents')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}))

// built-in middleware for json 
app.use(express.json());

// Middleware for cookies
app.use(cookieParser())

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use('/employee', require('./routes/employee'))
app.use('/asset', require('./routes/asset'))
app.use('/department', require('./routes/department'))
app.use('/test', require('./routes/test'))



app.use(verifyJWT)


// app.all('/{*splat}', (req, res)=>{
app.all('*splat', (req, res)=>{
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// errors handling
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));