const flash = require('connect-flash');
const express = require('express');
const User = require('../db/User');
const localStrat = require('passport-local');
const bcrypt = require('bcrypt');
const passport = require('passport');
const crypto = require('crypto')
const { nanoid }=require('nanoid');
const nodemailer=require('nodemailer');
const {cloudinary} = require('../cloudinary');

const genders = ['Male','Female','Other'];

const transporter=nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.email_password,
        }
    }
    );
    
    
    require('dotenv').config();
    
    
    module.exports.login=(req, res, next) => {
        const curUser=req.user;
        console.log(curUser);
        if (req.session.returnTo) {
            res.redirect(req.session.returnTo);
            return;
        }
        req.flash('success', 'Welcome Back!');
        console.log(req.session.returnTo)
        res.redirect(req.session.returnTo || '/');
        
    }
    
    module.exports.logout = (req,res)=>{
        req.logout(err=>{
            if (err){ 
                return next(err); 
            }
            req.flash('success','Logged Out Successfully!');
            res.redirect('/');
        })
    };
    
    module.exports.verify=async (req, res, next) => {
        console.log(req.body);
        let userData = {
            email: req.body.email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
        }
        if(req.body.College !== undefined){
            userData.College = req.body.College,
            userData.Graduation = req.body.Graduation
        }
        else{
            userData.Company = req.body.Company,
            userData.role =  "Employer",
            userData.about =  req.body.about
        }
        console.log(userData);
        let user = new User(userData);
        if (parseInt(req.session.code, 10) === parseInt(req.body.code, 10)) {
            console.log(user)
            user=await User.register(user, req.body.password);
            req.logIn(user, (err) => {
            if (err){
                    console.log(err);
                    req.flash('error', err.message);
                    res.redirect('/login');
                }
            });
            const resetEmail={
                to: user.email,
                from: process.env.email,
                subject: 'Account Has Been Successfully Verified',
                text: `Account Has Been Successfully Created At Job-Shala.`,
            }
                    
            transporter.sendMail(resetEmail, (err, info) => {
                if (err) {
                    console.log(err);
                    res.send('Error While Sending Mail');
                }
                else {
                    console.log(info.response);
                    req.flash('success', 'Successfully Registered!');
                    res.redirect('/');
                }
            })
        }
        else{
            req.flash('error', 'Code Does not match!');
            res.render('users/verify', { curUser : req.body });
        }
                
    }
    
    module.exports.register = async (req, res, next) => {
        try {
            console.log(req.body);
            const token=Math.floor(Math.random()*900000+100000);
            req.session.code=token;
            const registerEmail={
                from: process.env.email,
                to: req.body.email,
                subject: "Email Verification",
                text: `
                CODE: ${token}
                If you did not request this, please ignore this email.
                `,
            }
            transporter.sendMail(registerEmail, (err, info) => {
                if (err) {
                    console.log(err);
                    req.flash('Error While Sending Mail');
                    return res.redirect('/')
                }
                else {
                    console.log(info.response);
                    req.flash('success', 'Verification mail sent Successfully!');
                    res.render('users/verify', { curUser : req.body });
                }
            })
            
        }    
        catch (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/login');
        }
        
    }

    module.exports.forgotPassword = async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) {
            req.flash('error','Cannot find that user!');
            return res.redirect('/forgot-password');
        }
    
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 900000; // 15 mins
    
        await user.save();
    
        const baseURL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://localhost:3000';

        const resetPasswordLink = `${baseURL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.email,
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) has requested the reset of the password for your Job Shala account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetPasswordLink}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged. The link is valid for 15 mins\n`
        };
    
        transporter.sendMail(mailOptions, (err,info) => {
            if (err) {
                console.log(err);
                req.flash('Error While Sending Mail');
                return res.redirect('/')
            }
            else {
                console.log(info.response);
                req.flash('success', 'Password Reset Link sent Successfully!');
                return res.redirect('/login')
            }
        });
    };

    module.exports.resetPassword = async(req,res)=>{
        const { password } = req.body;
        const { token } = req.params;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
       console.log(user)
        if (!user) {
            req.flash('error','Invalid or expired token!');
            return res.redirect('/login');
        }
        try {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.setPassword(password,function(err,us){
                user.save();
            });
            req.flash('success','Password Reset successfully');
            return res.redirect('/login')
        } 
        catch (error) {
            req.flash('error','Error Resetting Password');
            return res.redirect('/login')
        }
    }
    
    module.exports.renderProfilePage = async(req,res)=>{
        const {id} = req.params;
        const user = await User.findById(id);
        console.log(user);
        if(!user){
            req.flash('error','Cannot find that user!');
            return res.redirect('/'); //Necessary to redirect
        }
        res.render('profile/student',{user,genders});
    };
    
    module.exports.updateProfile = async(req,res)=>{
        const {id} = req.params;
        console.log(req.body);
        const user = await User.findByIdAndUpdate(id,{...req.body},{new:true});
        // console.log('meow')
        // console.log(req.files)
        if (req.files['image']) {
            const imageFiles = req.files['image'].map(file => ({ url: file.path, filename: file.filename }));
            user.images.push(...imageFiles);
        }
    
        // Process uploaded resumes
        if (req.files['resume']) {
            const originalname = req.files['resume'][0].originalname;
            const resumeFile = req.files['resume'][0]; // Assuming only one resume file is uploaded
            const resume = { url: resumeFile.path, filename: originalname };
            user.resume.push(resume);
        }
        await user.save();
        req.flash('success','Successfully updated profile')
        res.redirect('/');
    };
            
        
            
            
            