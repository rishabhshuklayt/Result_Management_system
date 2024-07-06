const mongoose = require('mongoose')

const subject = new mongoose.Schema({
    code:{
        type: String,
        unique:true,
        required:true
    },
    subname: {
        type:String,
        required:true
    }
    // type:[{
    //     type:String,
    //     required:true
    // }]
})

module.exports = mongoose.model('subjectCode', subject);