const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware')
const User = require('../db/User.js');

router.get('/employerdashboard', isLoggedIn, (req, res) => {
    res.render('dashboard/employerdashboard');
})


router.get('/studentdashboard',isLoggedIn, async (req, res) => {    
    const user = await User.findById(req.user._id).populate('Jobapplication');
    console.log(user.Jobapplication)
    res.render('dashboard/studentdashboard',{jobApplications : user.Jobapplication});
})

module.exports=router;
