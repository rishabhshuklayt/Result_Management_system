const express = require('express')
const router = express.Router()
const multer = require('multer')
const bcrypt = require('bcrypt')
const StudentModel = require('../model/student')
const OTPmodel = require('../model/otp')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const transporter = require('../controllers/mailer')
const bodyparser = require("body-parser");
const { isLoggedIn } = require('../middleware/isLoggedIn')
router.use(bodyparser.urlencoded({ extended: false }));
router.use(bodyparser.json());
router.use(session({ secret: process.env.JWT_KEY, resave: false, saveUninitialized: true }));
require('dotenv').config()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/register', (req, res, next)=>{
    try {
     res.render('studentRegistration')
    } catch (err) {
         next(err)
    }
 })

 router.post('/register', upload.single('stuAvatar'), async (req, res, next) => {
    try {
      const { firstName, lastName, rollNumber, password, email, phoneNo, gender, dateOfBirth, department, branch, yearOfStudy } = req.body;
      const stuAvatar = req.file;
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      req.session.user = {
        firstName,
        lastName,
        rollNumber,
        password: hash,
        email,
        phoneNo,
        gender,
        dateOfBirth,
        department,
        branch,
        yearOfStudy,
        stuAvatar: stuAvatar.buffer
      };

      // jwt token 

      const token = jwt.sign({ email: StudentModel.email, id: StudentModel._id }, process.env.JWT_KEY);


      res.cookie('token', token);
        

        
  
      // OTP generation and sending
      const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
      });
      const newotp = OTPmodel({ otp, email });
      await newotp.save();
  
      const mailOptions = {
        from: 'spiderweb07man@gmail.com',
        to: email,
        subject: 'OTP for Result Management System Verification',
        text: `Dear ${firstName} ${lastName}, You have requested to verify your access to the Result Management System. Please use the following OTP (One-Time Password) to proceed with the verification: OTP: ${otp} This OTP is valid for a limited time and should not be shared with anyone. If you did not request this OTP, please ignore this email. Thank you`
      };
      await transporter.sendMail(mailOptions);
  
      res.redirect('/student/verifyOtp');
    } catch (err) {
      next(err);
    }
  });


  router.get('/verifyOtp', (req, res, next)=>{
    try {
        res.render('verifyOtp')
    } catch (err) {
        next(err)
    }
 })

 router.post('/verifyOtp', async(req, res, next)=>{
    try {
        const { email, otp } = req.body
       const OTPfound =  OTPmodel.findOne({email: email, otp:otp})
        if(OTPfound){
            const user = req.session.user
            if(user){
                const newStudent = new StudentModel(user)                
                await newStudent.save();   
                req.session.destroy()
                // res.redirect(`/student/${rollNumber}`)
                return res.json({ success: true, rollNumber: user.rollNumber });
            }
            else{
                return res.json({ success: false, message: 'Session expired. Please try again.' });
                // res.redirect('/student/verifyOtp?error=invalid');
            }
        }
        else{
            // res.redirect('/student/verifyOtp?error=invalid');
            return res.json({ success: false, message: 'Invalid OTP' });
        }
    } catch (err) {
        next(err)
    }
 })

 router.get('/studentdashboard', (req, res, next)=>{
        res.render('studentDashboard')
 })

 router.post('/studentdashboard', async(req, res, next)=>{
    try {
        const rollNumber = req.params.rollNumber
        const student = await StudentModel.findOne({ rollNumber: rollNumber })
        if(student){
            res.render('studentDashboard', { student })
        }
        else{
            res.status(404).send('Student not found')
        }
    } catch (err) {
        next(err)
    }
 })


//  app.get('/login', (req,res)=>{
//     const error = req.query.error;
//     res.render('login', { error: error })
//  })


//  .post('/login', async (req, res, next) => {
//     try {
//         const { rollNumber, password, captcha } = req.body;
//         const sessionCaptcha = req.session.captcha;
//         const student = await StudentModel.findOne({ rollNumber: rollNumber });
//         if (captcha === sessionCaptcha) {
//             if (student) {
//                 const match = await bcrypt.compare(password, student.password,function(err, result) {
//                     if(result){
//                         try {
//                             const token = jwt.sign({ email: StudentModel.email, id: StudentModel._id }, process.env.JWT_KEY);


//                             res.cookie('token', token);
//                             res.redirect(`/student/${rollNumber}`);
//                         } catch (error) {
//                             next(err)
//                         }
                       
//                     }
//                 });
//                 // res.render('studentProfile', { student }); 
//             } else {
//                 res.redirect('/login?error=invalid');
//             }
//             console.log('Login successful');
//         } else {
//             res.redirect('/login/?error=invalidCaptcha');
//         }
       
//     } catch (err) {
//         next(err);
//     }
// });

  module.exports = router