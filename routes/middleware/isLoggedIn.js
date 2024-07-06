const express = require('express')
const flash = require('connect-flash')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const StudentModel = require('../model/student')
require('dotenv').config()




const  isLoggedIn = async(req, res, next)=>{
    if (!req.cookies.token) {
        req.flash("error","You need to be logged in to access this page.")
        res.redirect('/login');
    } 
    else {
        try{
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
            let user = await StudentModel.findOne({email: decoded.email}).select("-password")
            req.user = user
            next();
        }
        catch(err){
            req.flash("error","Session expired. Please try again.")
            res.redirect('/login');
        }
    }
}

module.exports = { isLoggedIn };