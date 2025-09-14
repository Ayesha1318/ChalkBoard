const path = require('path');
const express = require('express');
const multer = require("multer");

const userRouter = express.Router();
const rootDir = require('../utils/pathUtil');
const { generateResponse } = require('../aiAgent');
const { handlePdfWithAI } = require("../aiAgent");

const upload = multer({ dest: "uploads/" });

userRouter.get("/",(req,res,next)=>{
   res.render('home',{ activeTab: "home",subjectName: null, autoPdf: "", autoTask: "" });
})
userRouter.get("/home",(req,res,next)=>{
    res.render('home',{ activeTab: "home",subjectName: null, autoPdf: "", autoTask: "" });
})

userRouter.post("/ai-response", async (req, res) => {
  try {
    const messageInput = req.body?.messageInput;

    if (!messageInput) {
      return res.status(400).json({ error: "No message input provided" });
    }

    const generatedCode = await generateResponse(messageInput);
    
    res.json({ code: generatedCode });

  } catch (err) {
    console.error("Error in /ai-response:", err);
    res.status(500).json({ error: "Failed to respond" });
  }
});

userRouter.post("/upload-pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    const task = req.body.task
    const filePath = req.file.path;

    const aiResponse = await handlePdfWithAI(filePath, task);

    res.json({ result: aiResponse });
  } catch (err) {
    console.error("Error in /upload-pdf:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

userRouter.get("/class",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('class');
   
    res.render('home',{ activeTab: "home" ,subjectName: null});
})
const subjects=[
  { name: "Operating System", className: "BCS-3D", teacher: "Dr. Soumi Paul" },
          { name: "Artificial Intelligence", className: "BCS-3D", teacher: "Dr. Ratnadeep Dey" },
    { name: "DBMS", className: "BCS-3D", teacher: "Dr. Priyanka Saha" },
    { name: "Mathametics-IV", className: "BCS-3D", teacher: "Dr. Sayan Sengupta" },
    { name: "CASD", className: "BCS-3D", teacher: "Dr. Koyel Chanda" },
    { name: "Physics", className: "BCS-3D", teacher: "Dr. Rajeswar Panja" }
    
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

userRouter.get("/generate-summary", (req, res) => {
  const pdfFile = req.query.pdf;
  const task = "Generate Summary";

  res.render("home", { 
    activeTab: "home",
    subjectName: null,
    autoPdf: pdfFile,
    autoTask: task
  });
});

userRouter.post("/generate-summary",(req,res,next)=>{
  res.render('home',{ activeTab: "home",subjectName: null });
})
   



module.exports = userRouter;