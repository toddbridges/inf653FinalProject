require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
// const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyState = require('./middleware/verifyState.js');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

connectDB();


// Cross origin resource sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files like css, or files that do not change
app.use('/', express.static(path.join(__dirname, '/public')));


app.use('/', require('./routes/root'));

app.use('/states', require ('./routes/api/states.js'));

// catch all for incorrect routes
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
    
})

app.use(errorHandler);


mongoose.connection.once('open', () => {
    console.log('Connected to MONGODB');
    app.listen(PORT, () => console.log(`Svr running on port ${PORT}`));
})
