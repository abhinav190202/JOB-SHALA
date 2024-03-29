const express=require('express');
const router=express.Router();
const {createinternship, showInternship, deleteInternship, updateInternship, renderEditForm,  getAllInternships, Applyinternship} = require('../controller/internshipcontroller');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isEmployer, validateInternship, isInternshipOwner} = require('../middleware')
const Internship = require('../db/Internship.js');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })



router.route('/')
.get(catchAsync(getAllInternships))
.post(isLoggedIn,validateInternship,catchAsync(createinternship));




router.route('/new').get(isLoggedIn,isEmployer,(req, res) => {
    res.render('internships/internshipform');
})
.post(isLoggedIn,isEmployer,validateInternship,createinternship);


router.route('/:id')
    .get(catchAsync(showInternship))
    .put(isLoggedIn, isInternshipOwner, validateInternship, catchAsync(updateInternship))
    .delete(isLoggedIn, catchAsync(deleteInternship))
    .post(isLoggedIn,upload.array('resume'),catchAsync(Applyinternship));


router.get('/:id/edit', isLoggedIn, isInternshipOwner, catchAsync(renderEditForm));


module.exports=router;