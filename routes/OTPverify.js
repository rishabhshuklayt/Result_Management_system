// const express = require('express')
// const app = express.Router()
// const OTPmodel = require('../model/otp')
// const StudentModel = require('../model/student')



// // Require controller modules
// router.get('/student/verifyOtp', (req, res, next)=>{
//     try {
//         res.render('verifyOtp')
//     } catch (err) {
//         next(err)
//     }
//  })

// //  post verify otp

//  router.post('/student/verifyOtp', async(req, res, next)=>{
//     try {
//         const { email, otp } = req.body
//        const OTPfound =  OTPmodel.findOne({email: email, otp:otp})
//         if(OTPfound){
//             const user = req.session.user
//             if(user){
//                 const newStudent = new StudentModel(user)                
//                 await newStudent.save();   
//                 req.session.destroy()
//                 // res.redirect(`/student/${rollNumber}`)
//                 return res.json({ success: true, rollNumber: user.rollNumber });
//             }
//             else{
//                 return res.json({ success: false, message: 'Session expired. Please try again.' });
//                 // res.redirect('/student/verifyOtp?error=invalid');
//             }
//         }
//         else{
//             // res.redirect('/student/verifyOtp?error=invalid');
//             return res.json({ success: false, message: 'Invalid OTP' });
//         }
//     } catch (err) {
//         next(err)
//     }
//  })

//  module.exports = router;  // Export the router for use in our app.js file.  This allows us to include this router in our app.js file and use its routes.  For example, app.use('/api', router) in app.js.  This will allow us to access our routes at '/api/student/verifyOtp' and so forth.  The router will be used to handle all requests that start with '/api/student' and pass
