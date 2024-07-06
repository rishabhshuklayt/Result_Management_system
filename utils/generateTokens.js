const jwt = require('jsonwebtoken')

const generateToken = (StudentModel)=>{
    const token = jwt.sign({email: StudentModel.email, id: StudentModel._id}, process.env.JWT_KEY)
    
}

module.exports.generateToken = generateToken;