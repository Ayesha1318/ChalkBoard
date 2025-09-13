const path = require('path');
const express = require('express');
const multer = require("multer");

const userRouter = express.Router();
const rootDir = require('../utils/pathUtil');
const { generateResponse } = require('../aiAgent');
const { handlePdfWithAI } = require("../aiAgent");

const upload = multer({ dest: "uploads/" });

userRouter.get("/",(req,res,next)=>{
   res.render('home');
})
userRouter.get("/home",(req,res,next)=>{
    res.render('home');
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
})
userRouter.get("/dashboard",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('dashboard');
})



module.exports = userRouter;