const express=require('express');
const router=express.Router();
const {createjob, getAllJobs, showJob, deleteJob, updateJob, renderEditForm, Applyjob} = require('../controller/jobcontroller');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isEmployer, validateJob, isJobOwner} = require('../middleware')
const Job = require('../db/Job.js');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
.get(catchAsync(getAllJobs))
.post(isLoggedIn,isEmployer,validateJob,catchAsync(createjob));

router.route('/new').get(isLoggedIn,isEmployer,(req, res) => {
    res.render('jobs/jobform');
})

router.route('/:id')
    .get(catchAsync(showJob))
    .put(isLoggedIn, isJobOwner, validateJob, catchAsync(updateJob))
    .delete(isLoggedIn, catchAsync(deleteJob))
    .post(isLoggedIn,upload.array('resume'),catchAsync(Applyjob));

    
router.get('/:id/edit', isLoggedIn, isJobOwner, catchAsync(renderEditForm));

module.exports=router;