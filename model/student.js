const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth:{type: Date, required: true},
    stuAvatar: {type: Buffer, required: true},
    gender:{type: String, required: true},
    email: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true
    },
    phoneNo:{type:Number, required:true},
    department: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    // courses: [{ type: String, required: true }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    branch:{type: String , required:true},
    // exams: [examResultSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }


})

module.exports = mongoose.model('Student', studentSchema)