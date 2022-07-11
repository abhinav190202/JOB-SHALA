const session = require('express-session')
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Mongostore = require('connect-mongo');
const ejsmate = require('ejs-mate');
const dotenv = require('dotenv');
const cors = require('cors');

const loginRoute = require('./routes/loginroute');
const path = require('path');
const flash = require('express-flash');
const passport = require('passport');
const User = require('./db/User');
const localStrat = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
require("dotenv/config");


const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({ secret: 'Enter Secret Here', saveUninitialized: false, resave: false }));

// Configuring Flash

app.use(flash());
//Passport configure

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat({
    usernameField: 'email'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', loginRoute);

const PORT = process.env.PORT;

app.get('/jobs', (req, res) => {
    res.render('jobs')
})

app.get('/', (req, res) => {
    res.render('homepage');
})


mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTOpology: true })
    .then(() => app.listen(PORT, () => { console.log(`server is running on : ${PORT}`) }))
    .catch((err) => { console.log(err.message) });
