const { boolean } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url : String,
    filename : String
})

const resumeSchema = new Schema({
    url : String,
    filename : String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const userSchema = new Schema({

    FirstName: {
        type: String,
        required: true,
        max: 255
    },

    images : [imageSchema],

    resume : [resumeSchema],

    LastName: {
        type: String,
        required: false,
        max: 255
    },

    Company : {
        type : String,
        default : null  
    },

    College : {
        type : String,
        default : null  
    },

    Graduation : {
        type : Number,
        default : null
    },

    role : {
        type : String,
        default : 'Student'
    },

    Jobapplication : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Job'
        }
    ],
    
    Internshipapplication : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Internship'
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,


    Linkedin : {
        type : String,
        default : null
    },

    Github : {
        type : String,
        default : null
    },

    Other : {
        type : String,
        default : null
    },
    
    Gender : {
        type : String,
        default : null
    },

    Dateofbirth : {
        type : String,
        default : null
    },

    Joining : {
        type : Number,
        default : null
    },

    Mobile : {
        type : Number,
        default : null
    },

    Field : {
        type : String,
        default : null
    },

    Degree : {
        type : String,
        default : null
    },

    Expertise : {
        type : String,
        default : null
    },

    State : {
        type : String,
        default : null
    },

    City : {
        type : String,
        default : null
    },

    Address : {
        type : String,
        default : null
    },

    Pincode : {
        type : Number,
        default : null
    }

   
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email'});

module.exports = new mongoose.model('User', userSchema);