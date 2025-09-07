const path = require('path');
const express = require('express');
const app = express();

const userRouter = require('./routes/userRouter');

const rootDir = require('./utils/pathUtil')
app.use(userRouter);

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(rootDir,'public')));

const PORT = 3000;
app.listen(PORT,()=>{
console.log(`Server is running on: http://localhost:${PORT}`);
})