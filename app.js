require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const router = require('./routers/router.js');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

// session
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const config = require('./config/config');

// mongoose
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// views
app.set('view engine', 'ejs');
app.use(expressLayouts);

// routes
app.use(express.static('public'));
app.use(session({secret: process.env.SECRET, saveUninitialized: true, resave: false}));
app.use(flash());
config.config();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));
app.use('/', router);


app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
