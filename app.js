const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express()
const port = 3000
const ejs = require('ejs')
const transporter = require('./controllers/mailer')
const flash = require('connect-flash')
const path = require('path')
const svgCaptcha = require('svg-captcha');
const multer = require('multer')
const StudentModel = require('./model/student')
const SubjectModel = require('./model/subject')
const mongooseConnection = require('./config/mongoose')
const student = require('./model/student')
const otpGenerator = require('otp-generator')
const OTPmodel = require('./model/otp')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const bodyparser = require("body-parser");
const jwt = require('jsonwebtoken')
const adminRoutes = require('./routes/admin')
const studentRoutes  = require('./routes/student')
const { isLoggedIn } = require('./middleware/isLoggedIn')
require('dotenv').config();



// Middleware

app.use('/admin', adminRoutes)
app.use('/student', studentRoutes)
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser())
app.use(flash())
app.use(session({ secret: process.env.JWT_KEY, resave: false, saveUninitialized: true }));
app.use(express.urlencoded({extended: true}))
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.set('view engine', 'ejs')

// Routes
app.get('/', (req, res) => {
    res.render('index')
})


 app.get('/login', (req,res)=>{
    const error = req.query.error;
    res.render('login', { error: error })
 })

    app.post('/login', async (req, res, next) => {
        try {
            const { rollNumber, password, captcha } = req.body;
            const sessionCaptcha = req.session.captcha;
            const student = await StudentModel.findOne({ rollNumber: rollNumber });
            if (captcha === sessionCaptcha) {
                if (student) {
                    const match = await bcrypt.compare(password, student.password,function(err, result) {
                        if(result){
                            try {
                                const token = jwt.sign({ email: StudentModel.email, id: StudentModel._id }, process.env.JWT_KEY);
    
    
                                res.cookie('token', token);
                                res.redirect(`/student/${rollNumber}`);
                            } catch (error) {
                                next(err)
                            }
                           
                        }
                    });
                    // res.render('studentProfile', { student }); 
                } else {
                    res.redirect('/login?error=invalid');
                }
                console.log('Login successful');
            } else {
                res.redirect('/login/?error=invalidCaptcha');
            }
           
        } catch (err) {
            next(err);
        }
    });
// logour 
app.get('/logout', (req, res) => {
    try {
        // Clear the JWT token from the cookies
        res.clearCookie('token');
        
        // Destroy the session if you're using session management
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Failed to log out. Please try again.');
            }
            
            // Redirect to the login page or any other page
            res.redirect('/login');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred during logout. Please try again.');
    }
});


 // Login OneviewStudent Route 
    app.get('/login/oneview', isLoggedIn,(req, res, next)=>{
        try {
             const error = req.query.error;
            res.render('loginOneview', { error: error });

        } catch (err) {
            next(err)
        }
    })
// post login 

app.post('/login/oneview', isLoggedIn, async (req, res) => {
    const { rollNumber, dateOfBirth, captcha } = req.body;
    const sessionCaptcha = req.session.captcha;
    const Studentfound = await StudentModel.findOne({rollNumber: rollNumber, dateOfBirth:dateOfBirth})
    if (captcha === sessionCaptcha) {
        if(Studentfound){
            res.redirect(`/student/${rollNumber}`);
            req.session.destroy()
        }
        else{
            res.redirect('/login/oneview?error=invalid');
        }
        console.log('Login successful');
    } else {
        res.redirect('/login/oneview?error=invalidCaptcha');
    }
});

 // captcha
 app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});   
// Faculty Registration Route

app.post('/faculty/register', (req, res, next)=>{
   try {
    res.render('facultyRegistration')
   } catch (err) {
        next(err)
   }
})

// Student profile route 

app.get('/student/:profile', isLoggedIn, async(req, res, next)=>{
    try {
        const student = req.params.profile
       const Studentfound = await StudentModel.findOne({ rollNumber: student})
       const stu = Studentfound
        if(stu){
            res.render('studentProfile', {stu});
            console.log("succefully rendered")
            req.session.destroy
        }
        else{
            res.status(404).send("Student not found")  
           
        }
    } catch (err) {
        next(err);
    }
})

// Exam Form dashbord
app.get('/exam/dashboard', isLoggedIn, async(req, res, next)=>{
    try {
        const students = await StudentModel.find({})
       res.render('examFormDashboard', {students})
    } catch (err) {
        next(err);
    }
})

// Exam Form Route
app.get('/exam/form/:rollNumber', isLoggedIn, async(req, res, next)=>{
    try {
        const student = req.params.rollNumber
        const subjectCode = await SubjectModel.find()
        console.log(subjectCode); 
       const Studentfound = await StudentModel.findOne({ rollNumber: student})
       const stu = Studentfound
        if(stu){
            res.render('examForm', {stu,subjectCode});
            console.log("succefully rendered")
        }
        else{
            res.status(404).send("Student not found")
        }
    } catch (err) {
        next(err);
    }
})

// Exam Form Submitted Route
    app.post('/exam/form/submitted',(req, res, next)=>{
        try {
            
        } catch (err) {
            next(err)
        }
    })


 // Hnalding teh user route

    app.get('/result/oneview/:username',isLoggedIn, async(req, res, next)=>{
        try {
            const student = req.params.username;
            const subject = SubjectModel.find()
           const stu = await StudentModel.findOne({rollNumber: student})
            res.render('oneView',{stu, subject})
        } catch (err) {
            next(err)
        }
    })



    app.get('/oneview',(req, res)=>{
        res.render('oneView')
    })
    

// ERROR Hanlder

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.message)
})


// Non existing rute handler 
app.get('*',(req, res)=>{
    res.status(404).send("dont play with url")
})


//listng port of server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))