if(process.env.NODE_ENV !== 'production'){ //This ensures that the dotenv files which contains the details of our cloudinary account won't be accessible when the project is in production mode and not in development mode
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const ejsmate = require('ejs-mate');
const dotenv = require('dotenv');
const flash = require('connect-flash');

const path = require('path');
const passport = require('passport');
const localStrat = require('passport-local');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');

const User = require('./db/User');
const loginRoute = require('./routes/loginroute');
const homeRoute = require('./routes/homeroute');
const jobRoute = require('./routes/jobroute');
const internshipRoute = require('./routes/internshiproute');
const dashboardRoute = require('./routes/dashboardroute');
const profileRoute = require('./routes/profileroute');

mongoose.set('strictQuery', false);
const dbUrl = process.env.CONNECTION_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});


const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// const secret = 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl : dbUrl,
    secret : 'yoyo',
    touchAfter : 24 * 60 * 60 
});

store.on("error",function(e){
    console.log("Session store error",e);
})

const sessionConfig = {
    store : store,
    name : 'session', 
    secret : 'yoyo',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        // secure : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge : 1000 * 60 * 60 * 24 * 7 
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat({
    usernameField: 'email'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(mongoSanitize());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.query=req.query;
    res.locals.user=req.user;
    next();
});


app.use('/', loginRoute);
app.use('/', homeRoute);
app.use('/jobs', jobRoute);
app.use('/internships', internshipRoute);
app.use('/', dashboardRoute);
app.use('/profile', profileRoute);



const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`server is running on : ${PORT}`) })
