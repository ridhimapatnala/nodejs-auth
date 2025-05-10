const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//register controller
const registerUser = async (req, res)=>{
    try{
        const {username, email, password, role} = req.body

        //check if user is existing in db
        const checkUserExists  = await User.findOne({$or : [{username},{email}]})
        if(checkUserExists){
            return res.status(400).json({
                success : false,
                message : "user already exists"
            })
        }
        // hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create new user and save in db
        const newUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || 'user'
        })

        await newUser.save()

        if(newUser){
            res.status(201).json({
                success : true,
                message : 'user registered successfully'
            })
        }else{
            res.status(404).json({
                success : false,
                message : 'user registration failed'
            })
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'error occured'
        })
    }
}

//login controller
const loginUser = async (req, res)=>{
    try{
        const {username, password} = req.body;

        // check if user is in db
        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({
                success : false,
                message : 'invalid credentials'
            })
        }

        // check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : 'invalid credentials'
            })
        }

        // create bearer token (of the logged in user)
        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role,
        }, process.env.JWT_SECRET, {
            expiresIn : '15m'
        })

        res.status(200).json({
            success : true,
            message : 'log in successfull',
            accessToken
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'error occured'
        })
    }
}

const changePassword = async(req, res)=>{
    try{
        const userId= req.userInfo.userId

        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).json({
                success : false,
                message : " user not found"
            })
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if(!isPasswordMatch){
            res.status(400).json({
                success : false,
                message : "old password does not match"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = newHashedPassword
        await user.save()

        res.status(200).json({
            success : true,
            message : "password changed successfully"
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'error occured'
        })
    }
}

module.exports = {registerUser, loginUser, changePassword}