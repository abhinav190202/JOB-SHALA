const mongoose = require('mongoose');

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
        required: true
    }
});

const InternshipSchema = mongoose.Schema({
    Name : {
        type : String,
        required : true,
        max : 255
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

    State : {
        type : String,
        required : true
    },
    
    Location : {
        type : String,
        required : true
    },

    Stipend : {
        type : Number,
        required : true
    },

    Duration : {
        type : Number,
        required : true
    },

    skills : {
        type : String,
        required : false
    },

    Employer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },

    Applicants : [applicantSchema],

    Descriptions : {
        type :String,
        required : false,
    },
    about : {
        type : String,
        required : false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports =  mongoose.model('Internship',InternshipSchema);

