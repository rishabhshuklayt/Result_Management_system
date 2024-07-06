const express = require('express')
const SubjectModel = require('../model/subject')
const { isLoggedIn } = require('../middleware/isLoggedIn')
const router = express.Router()

router.get('/', isLoggedIn, (req, res) => {
    res.render('Admin')
})


router.get('/action', (req, res, next) => {
    try{
        res.render('adminAction')
    }
    catch (err) {
        next(err)
    }
})

router.post('/store/subject', isLoggedIn, async (req, res, next) => {
    try {
        const subjects = [
            { code: 'KAS101T', subname: 'Engineering Physics' },
            { code: 'KAS103T', subname: 'Engineering Mathematics-I' },
            { code: 'KEE101T', subname: 'Basic Electrical Engineering' },
            { code: 'KCS101T', subname: 'Programming for Problem Solving' },
            { code: 'KMC101', subname: 'AI For Engineering' },
            { code: 'KAS151P', subname: 'Engineering Physics Lab' },
            { code: 'KEE151P', subname: 'Basic Electrical Engineering Lab' },
            { code: 'KCS151P', subname: 'Programming for Problem ' },
            { code: 'KCE151P', subname: 'Engineering Graphics & Design Lab' }
        ];

        for (const subject of subjects) {
            const newSubject = new SubjectModel(subject);
            await newSubject.save();
        }

        res.send("Subjects added successfully");
    } catch (err) {
        next(err);
    }
});

module.exports = router;