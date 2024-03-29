const Job = require('./db/Job');
const Internship = require('./db/Internship');
const ExpressError = require('./utils/ExpressError');
const {jobSchema, internshipSchema} = require('./schemas.js')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateJob = (req,res,next)=>{
    const {error} = jobSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(','); //Iterating over the details object of error returned by JOI
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
}

module.exports.isJobOwner = async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job.Employer.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/jobs/${id}`);
    }
    next();
}

module.exports.isInternshipOwner = async(req,res,next)=>{
    const {id} = req.params;
    const internship = await Internship.findById(id);
    if(!internship.Employer.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/internships/${id}`);
    }
    next();
}

module.exports.isEmployer = async(req,res,next)=>{
    if(req.user.role !== "Employer"){
        req.flash('error','Only Employers are allowed to post jobs/internships');
        return res.redirect('/');
    }
    next();
}

module.exports.isStudent = async(req,res,next)=>{
    if(req.user.role !== "Student"){
        req.flash('error','Only Students are allowed to edit their profile');
        return res.redirect('/');
    }
    next();
}



module.exports.validateInternship = (req,res,next)=>{
    const {error} = internshipSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(','); //Iterating over the details object of error returned by JOI
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
}