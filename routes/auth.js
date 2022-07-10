const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {registerValidation, loginValidation} = require('../validation')



router.post('/register', async (req, res) => {

    

    //Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email})  //checks if the email is smae as the email in the database
    if(emailExist) return res.status(400).send('Email already exists')


    //Hash Passwords
    const salt = await bcrypt.genSalt(10)      //Generating Salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt)     //combines password and creates a complex encrypted password


    //Create a new user
    const user = new User({
        name: req.body.name,
        email:req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send(err)   //show 400 error and send error message
    }
})

//LOGIN
router.post('/login', async (req, res)=> {
    // //LETS VALIDATE THE DATA BEFORE WE SAVE A USER
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Checking if the email is already exists in the database
    const user = await User.findOne({email: req.body.email})  //checks if the email is smae as the email in the database
    if(!user) return res.status(400).send('Email is not found')
    //PASSWORD IS CORRECT 
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid Password!')

    //Create and assign a toekn
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)     //Sending user_id
    res.header('auth-token', token).send(token)


    res.send('Logged in!')
})


module.exports = router

