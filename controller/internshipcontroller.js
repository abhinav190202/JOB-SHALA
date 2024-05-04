const Internship = require('../db/Internship.js');
const Features = require('../utils/features');
const express = require('express');
const User = require('../db/User.js');

require('dotenv').config();

module.exports.getAllInternships = (async (req, res, next) => {
    let resultperpage=4;

    console.log("Query: ", req.query);

    let features=new Features(Internship.find(), req.query)
    .search()
    .filter()

    let internships = await features.query;
    console.log(internships)

    let sze=internships.length;
    
    let currentPage=Number(req.query.page||1);

    if (!internships) 
    {
      return next(new Apperror('internships not found', 404))
    }
    
    if (internships.length==0) 
    {
      res.render('internships/nointernship');
      return;
    }

    req.query.mi = Number(req.query.mi||0);
   
    res.render('internships/internships',{internships,page: currentPage, mxLength: sze});

  });



module.exports.createinternship  = async (req,res,next) => {

    
    try {
        const internship = new Internship({
            Name : req.body.Name,
            Descriptions : req.body.Descriptions,
            Company : req.user.Company,
            Lastdate : req.body.Lastdate,
            Startdate : req.body.Startdate,
            skills : req.body.skills,
            Stipend : req.body.Stipend, 
            Duration : req.body.Duration,
            // Employer : req.user
            State : req.body.State,
            Location : req.body.Location,
            about : req.user.about
        });
        
        internship.Employer = req.user._id;
        const isCreated = await internship.save();
        if(isCreated)
        {
           const user = await User.findById(req.user._id);
           user.createdInternships.push(internship);
           await user.save();
           res.redirect('/internships');
           req.flash('success_msg','Internship Created Successfully');
        }
        else
        {
            console.log('Internship not Created');
        }
    } 
    catch (err) {
       console.log(err); 
    }    
};

module.exports.showInternship = async(req,res)=>{
    const {id} = req.params;
    const internship = await Internship.findById(id)
    const user = req.user;
    // .populate({
    //     path : '',
    //     populate : {
    //         path : 'author'
    //     }
    // }).populate('author');
    if(!internship){
        req.flash('error','Cannot find that internship!');
        return res.redirect('/internships'); //Necessary to redirect
    }
    
    res.render('internships/internshippage',{internship,user});
};

module.exports.deleteInternship = async(req,res)=>{
    const {id} = req.params;
    const deletedInternship = await Internship.findByIdAndDelete(id);
    req.flash('success','Successfully deleted an Internship!');
    res.redirect('/internships');
};

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const internship = await Internship.findById(id);
    if(!internship){
       req.flash('error','Cannot find that internship!');
       return res.redirect('/internships'); 
   }
    res.render('internships/internshipedit',{internship});
};

module.exports.updateInternship = async(req,res)=>{
    const {id} = req.params;
    const internship = await Internship.findByIdAndUpdate(id,{$set : req.body},{new:true});
    await internship.save();
    req.flash('success','Successfully updated internship!')
    res.redirect(`/internships/${internship._id}`);
};

module.exports.Applyinternship = async (req,res,next) =>{
    const user = await User.findById(req.user._id);
    const Internshipfind = await Internship.findById(req.params.id);
    for(var i = 0; i < user.Internshipapplication.length; i++)
    {
        if(user.Internshipapplication[i]._id.toString() === req.params.id)
        {
            req.flash('error','You have already applied for this internship');
            return res.redirect('/internships');
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
        Internshipfind.Applicants.push(newApplicant);      
    }
    else if(req.body.resume !== 'Select'){
       const resumeDetails = req.body.resume;
       const[filename,url] = resumeDetails.split('|');
       const newApplicant = {
           user : user,
           resume : {filename : filename, url : url}
        }
       Internshipfind.Applicants.push(newApplicant); 
    }
    else{
        const {id} = req.params;
        const internship = await Internship.findById(id);
        req.flash('error','Please choose or upload a resume');
        return res.redirect(`/internships/${internship._id}`)
    }
    user.Internshipapplication.push(Internshipfind);
    await user.save();
    await Internshipfind.save();
        req.flash('success','You have successfully applied for this internship'); 
        res.redirect('/internships');
 
}



