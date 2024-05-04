const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isEmployer,isStudent} = require('../middleware')
const User = require('../db/User.js');
const Job = require('../db/Job.js');
const Internship = require('../db/Internship.js');

router.get('/employerdashboard', isLoggedIn, isEmployer, async (req, res) => {
    const user = await User.findById(req.user._id).populate('createdJobs').populate('createdInternships')
    res.render('dashboard/employerdashboard',{createdJobs : user.createdJobs, createdInternships : user.createdInternships});
})

router.get('/employerdashboard/roles/:id', isLoggedIn, isEmployer, async (req, res) => {
    const {id} = req.params
    const job = await Job.findById(id).populate('Applicants.user')
    if(job.Applicants.length == 0){
        res.render('dashboard/noapplicants',{st : "Sorry, No Applicants Yet!"})
        return ;
    }
    res.render('dashboard/applicants',{job : job});
})

router.get('/employerdashboard/roles/intern/:id', isLoggedIn, isEmployer, async (req, res) => {
    const {id} = req.params
    const intern = await Internship.findById(id).populate('Applicants.user')
    if(intern.Applicants.length == 0){
        res.render('dashboard/noapplicants',{st : "Sorry, No Applicants Yet!"})
        return ;
    }
    res.render('dashboard/applicants',{job : intern});
})

router.get('/employerdashboard/profile/:id',isLoggedIn, isEmployer, async (req, res) => {  
    const {id} = req.params  
    const empId = req.user._id;
    const user = await User.findById(id)
    res.render('dashboard/applicantprofile',{user,empId});
})

router.get('/studentdashboard',isLoggedIn, isStudent, async (req, res) => {    
    const user = await User.findById(req.user._id).populate('Jobapplication').populate('Internshipapplication');
    res.render('dashboard/studentdashboard',{jobApplications : user.Jobapplication, internshipApplications : user.Internshipapplication});
})


module.exports=router;
