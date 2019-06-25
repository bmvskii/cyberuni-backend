const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('../db');

const studentRouter = require('../routes/student');
const taskRouter = require('../routes/task');
const teacherRouter = require('../routes/teacher');
const subjectRouter = require('../routes/subject');
const authRouter = require('../routes/auth');
const groupRouter = require('../routes/group');
const semesterRouter = require('../routes/semester');
const courseRouter = require('../routes/course');
const cathedraRouter = require('../routes/cathedra')
const userRouter = require('../routes/user');
 
const Task = require('../models/task')
const Teacher = require('../models/teacher')

const auth = require('../middleware/auth')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(studentRouter);
app.use(taskRouter);
app.use(teacherRouter);
app.use(subjectRouter);
app.use(semesterRouter);
app.use(courseRouter);
app.use(groupRouter);
app.use(authRouter);
app.use(cathedraRouter);
app.use(userRouter);

const multer = require('multer')
const uploads = multer({
  'dest': 'images',
});

app.listen(port, () => {
  console.log(`Express is working on ${port}`)
})