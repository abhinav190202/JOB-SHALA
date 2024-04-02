const Job = require('../db/Job.js');
const express = require('express');
const Features = require('../utils/features');
const User = require('../db/User.js');

require('dotenv').config();

module.exports.createjob  = async (req,res,next) => {
  
    try {
    
        // console.log(req.body);
        const job = new Job({
            Name : req.body.Name,
            Descriptions : req.body.Descriptions,
            Company : req.user.Company,
            Lastdate : req.body.Lastdate,
            Startdate : req.body.Startdate,
            skills : req.body.skills,
            CTC : req.body.CTC, 
            Category : req.body.Category,
            Employer : req.user,
            State : req.body.State,
            Location : req.body.Location,
            role : "job",
            about : req.user.about
        });

        console.log(req.user);
        job.Employer = req.user._id;
    
        const isCreated = await job.save();
 
        console.log(job);
        res.redirect('/jobs');
        if(isCreated)
        {
           console.log(isCreated);
           res.redirect('/jobs');
           req.flash('success_msg','Job Created Successfully');
        }
        else
        {
            console.log('Job not Created');
        }
    } 

    catch (err) {
       console.log(err); 
    }
    
}

module.exports.showJob = async(req,res)=>{
    const {id} = req.params;
    const job = await Job.findById(id)
    const user = req.user;

    if(!user){
        req.flash('error','You need to login first');
        return res.redirect('/login');
    }
    if(!job){
        req.flash('error','Cannot find that job!');
        return res.redirect('/jobs'); //Necessary to redirect
    }
    console.log(req.user);
    res.render('jobs/jobpage',{job,user});
};

module.exports.deleteJob = async(req,res)=>{
    const {id} = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a Job!');
    res.redirect('/jobs');
};

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
       req.flash('error','Cannot find that job!');
       return res.redirect('/jobs'); //Necessary to redirect
   }
    res.render('jobs/jobedit',{job});
};

module.exports.updateJob = async(req,res)=>{
    const {id} = req.params;
    console.log(req.body);
    const job = await Job.findByIdAndUpdate(id,{$set : req.body},{new:true});
    await job.save();
    req.flash('success','Successfully updated job!')
    res.redirect(`/jobs/${job._id}`);
};


exports.getAllJobs = (async (req, res, next) => {
    let resultperpage=4;

    console.log("Query: ", req.query);

    let features=new Features(Job.find(), req.query)
    .search()
    .filter()

    let jobs = await features.query;
    console.log(jobs)

    let sze=jobs.length;
    
    let currentPage=Number(req.query.page||1);

    if (!jobs) 
    {
      return next(new Apperror('jobs not found', 404))
    }
    
    if (jobs.length==0) 
    {
      res.render('jobs/nojob');
      return;
    }

    req.query.mi = Number(req.query.mi||0);
   
    res.render('jobs/jobs',{jobs,page: currentPage, mxLength: sze});

  })


exports.Applyjob = async (req,res,next) =>{
        const user = await User.findById(req.user._id);
        const Jobfind = await Job.findById(req.params.id);
        for(var i = 0; i < user.Jobapplication.length; i++)
        {
            // console.log(user.Jobapplication[i].toString());
            if(user.Jobapplication[i]._id.toString() === req.params.id)
            {
                req.flash('error','You have already applied for this job');
                return res.redirect('/jobs');
            }
        }
        if(req.files.length > 0){
            const resume = req.files[0];
            const filename = req.files[0].originalname;
            const url = req.files[0].path;
            const newApplicant = {
                user : user,
                resume : {filename : filename, url : url}
            }
            Jobfind.Applicants.push(newApplicant);      
        }
        else if(req.body.resume !== 'Select'){
           const resumeDetails = req.body.resume;
           const[filename,url] = resumeDetails.split('|');
           const newApplicant = {
               user : user,
               resume : {filename : filename, url : url}
            }
        Jobfind.Applicants.push(newApplicant); 
        }
        else{
            const {id} = req.params;
            const job = await Job.findById(id);
            req.flash('error','Please choose or upload a resume');
            return res.redirect(`/jobs/${job._id}`)
        }
        console.log(Jobfind);
        user.Jobapplication.push(Jobfind);
        await user.save();
        await Jobfind.save();
        // const ok = await user.populate('Jobapplication');
        // console.log(ok); 
            req.flash('success','You have successfully applied for this job'); 
            res.redirect('/jobs');
     
}