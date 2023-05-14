const dotenv = require(`dotenv`);
const mongoose = require('mongoose');
const express = require('express');
const app=express();

//connectiono with databse
dotenv.config({path: './config.env'});

require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());

//link the router file to make our route
app.use(require('./router/auth'));

const PORT = process.env.PORT;


//middleware
// const middleware = (req,res,next)=>{
//     console.log(`hello my middleware`);
//     next();
// }

// middleware();

// app.get('/',(req,res)=>{
//     res.send(`hello world from server`);
// });
// app.get('/about',(req,res)=>{
//     console.log(`hello about`);
//     res.send(`hello world from about`);
// });

app.get('/insights',(req,res)=>{
    // res.cookie("Test",'kavyanshi');
    res.send(`hello world from contact`);
});
app.get('/signin',(req,res)=>{
    res.send(`hello world from signin`);
});

app.get('/signup',(req,res)=>{
    res.send(`hello world from signup`);
});

// console.log(`subscribe`);

app.listen(PORT,()=>{
    console.log(`server running at port number ${PORT}`);
})