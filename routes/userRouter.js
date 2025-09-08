const path = require('path');
const express = require('express');

const userRouter = express.Router();
const rootDir = require('../utils/pathUtil');
const { generateResponse } = require('../aiAgent');

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


userRouter.get("/class",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('class');
})
userRouter.get("/dashboard",(req,res,next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'home.html'));
    res.render('dashboard');
})



module.exports = userRouter;