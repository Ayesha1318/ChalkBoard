const path = require('path');
const express = require('express');

const userRouter = express.Router();
const rootDir = require('../utils/pathUtil');

userRouter.get("/",(req,res,next)=>{
   res.render('home');
})
userRouter.get("/home",(req,res,next)=>{
    res.render('home');
})
userRouter.get("/class",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('class');
})
userRouter.get("/dashboard",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('dashboard');
})



module.exports = userRouter;