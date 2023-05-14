const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");
const cookieParser = require('cookie-parser');

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req,res) =>{
    res.send(`Hello world from server router js`);
});

router.use(cookieParser());

//using promises

// router.post('/register',(req,res)=>{

//     const {name,email,phone,password,cpassword} = req.body;

//     if(!name || !email || !phone || !password || !cpassword){
//         return res.status(422).json({error:"PLease fill the datails"});
//     }

//     User.findOne({email:email}).then((userExist) =>{
//         if(userExist){
//             return res.status(422).json({error:"Email already exist"});
//         }

//         const user = new User({name,email,phone,password,cpassword});
//         user.save().then(()=>{
//             res.status(201).json({message :"registered succesfully"});
//         }).catch((err) => res.status(500).json({error: "fail to register"}));
//     }).catch((err) => {console.log(err);});

// });


//using async

router.post('/register',async(req,res)=>{

    const {name,email,phone,password,cpassword} = req.body;

    if(!name || !email || !phone || !password || !cpassword){
        return res.status(422).json({error:"PLease fill the details"});
    }
    try{
        const userExist = await User.findOne({email:email})
        if(userExist){
            return res.status(422).json({error:"Email already exist"});
        }else if(password!=cpassword){
            return res.status(422).json({error:"confirm password correctly"});

        }else{
            const user = new User({name,email,phone,password,cpassword});
        // const userRegister = await user.save();
        await user.save();
        res.status(201).json({message :"registered succesfully"});
        }
    }
    catch(err){
        console.log(err);

    }

});
//login route
router.post('/signin',async (req,res)=>{
    try{
        let token;
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error :"please fill the data"});
        }
        //to check email matches the database email or not
        const userLogin =await User.findOne({email:email});
        // console.log(userLogin);

        if(userLogin){ 
            const isMatch = await bcrypt.compare(password,userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true

            });

            if(!isMatch){
                
                res.status(400).json({error:"Invalid Credentials"});
            }
            else{
                res.json({message:"Login successfully"});
            }
        }
        else{
            res.status(400).json({error:"Invalid Credentials"});
        }
    } 
    catch(err){
            console.log(err);
    }

});

//about us page
router.get('/about',authenticate ,(req,res)=>{
    console.log(`hello my about`);
    res.send(req.rootUser);
});

//logout page
router.get('/logout',(req,res)=>{
    console.log(`hello my logout`);
    res.clearCookie('jwtoken', {path:'/'});
    res.status(200).send('User Logout');
    
});



module.exports=router;