const mongoose = require('mongoose');
const User = require('./User.js');


const applicantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resume: {
        type: {
            url: String,
            filename: String
        },
        required: true // Ensure the 'resume' field is required for each applicant
    }
});

const jobSchema = mongoose.Schema({

    Name : {
        type : String,
        required : true,
        max : 255
    },

    State : {
        type : String,
        required : true
    },
    
    Location : {
        type : String,
        required : true
    },

    Descriptions : {
        type :String,
        required : false,
    },

    Company : {
        type : String,
        required: true,
        max : 255
    },
   
    Lastdate : {
        type : String,
        required : false
    },

    Startdate :{
        type : String,
        required : true
    },

    CTC : {
        type : Number,
        required : true
    },
    
    Employer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },

    Applicants : [applicantSchema],
    
    skills : {
        type : String,
        required : false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports =  mongoose.model('Job',jobSchema);