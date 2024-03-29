const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isStudent} = require('../middleware')
const users = require('../controller/auth')
const User = require('../db/User.js');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

router.get('/:id/edit', isLoggedIn, isStudent, catchAsync(users.renderProfilePage));
router.route('/:id')
.put(isLoggedIn, isStudent, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), catchAsync(users.updateProfile))


// router.get('/studentdashboard',isLoggedIn, async (req, res) => {    
//     const user = await User.findById(req.user._id).populate('Jobapplication');
 
//     res.render('dashboard/studentdashboard',{jobApplications : user.Jobapplication});
// })

module.exports=router;