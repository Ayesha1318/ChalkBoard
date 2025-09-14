require("dotenv").config();
const path = require('path');
const express = require('express');
const app = express();

app.set('view engine','ejs');
app.set('views','views');

const userRouter = require('./routes/userRouter');

const rootDir = require('./utils/pathUtil')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir,'public')));
app.use(userRouter);

<<<<<<< HEAD
=======
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(rootDir,'public')));
app.use('/files', express.static('public/files'));
>>>>>>> 2bdd36d6bf80334bd05a8d566f3ff870b67a8de2

const PORT = 3000;
app.listen(PORT,()=>{
console.log(`Server is running on: http://localhost:${PORT}`);
})