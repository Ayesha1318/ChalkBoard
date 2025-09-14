const path = require('path');
const express = require('express');

const userRouter = express.Router();
const rootDir = require('../utils/pathUtil');

userRouter.get("/",(req,res,next)=>{
   res.render('home',{ activeTab: "home",subjectName: null });
})
userRouter.get("/home",(req,res,next)=>{
   
    res.render('home',{ activeTab: "home" ,subjectName: null});
})
const subjects=[
          { name: "Mathematics", className: "Class 10", teacher: "Mr. Sharma" },
    { name: "Science", className: "Class 9", teacher: "Mrs. Verma" },
    { name: "English", className: "Class 8", teacher: "Ms. Khan" }
    ];
userRouter.get("/class/:name", (req, res) => {
  const subjectName = req.params.name;
  const subject = subjects.find(s => s.name === subjectName);

  if (!subject) {
    return res.status(404).send("Subject not found");
  }

  res.render("classDetail", { 
    subject, 
    activeTab: "classes", 
    subjectName          // pass subjectName so sidebar can use it
  });
});
userRouter.get("/dashboard",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('dashboard',{ activeTab: "dashboard",subjectName: null });
})

userRouter.get("/class/:name",(req,res,next)=>{
    const subjectName=req.params.name;
    console.log(subjectName);
      const subject = subjects.find(s => s.name === subjectName);

  if (!subject) {
    return res.status(404).send("Subject not found");
  }

  res.render("classDetail", { subject, subjectName, activeTab: "classes" });
});
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
     userRouter.get("/classes", (req, res) => {
  // subjects should be your array of available subjects
  res.render("class", { 
    subjects, 
    activeTab: "classes", 
    subjectName: null 
  });
});
   



module.exports = userRouter;