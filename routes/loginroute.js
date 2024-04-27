const express=require('express');
const app=express();
const passport=require('passport');
const login=require('../controller/auth.js');
const flash = require('connect-flash');
const router=express.Router();

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local', {failureFlash: true, failureRedirect: '/login' }),login.login)

router.get('/registeremployer',(req,res)=>{
    res.render('users/registeremployer');
});
router.get('/registerstudent',(req,res)=>{
    res.render('users/registerstudent');
});

router.route('/verify')
.get(login.verify)
.post(login.verify);


router.post('/registeremployer',login.register);
router.post('/registerstudent',login.register);

router.get('/logout',login.logout);

router.get('/forgot-password',(req,res)=>{
   res.render('users/forgotpassword');
});

router.post('/forgot-password',login.forgotPassword);

router.get('/reset-password/:token',(req,res)=>{
    const {token} = req.params
    res.render('users/resetpassword',{token})
})

router.post('/reset-password/:token',login.resetPassword);

module.exports=router;


