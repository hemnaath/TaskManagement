const express = require('express');
const path = require('path');
const cors = require('cors');
require('./config/mongoConnector');
const passport = require('./middleware/auth');
const userRouting = require('./routes/userRoute');
const projectRouting = require('./routes/projectRoute');
const orgRouting = require('./routes/orgRoute');
const emailRouting = require('./routes/emailRoute');
const taskRouting = require('./routes/taskRoute');
const commentRouting = require('./routes/commentRoute');
const leaveRouting = require('./routes/leaveRoute');
const attendanceRouting = require('./routes/attendanceRoute');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());
app.use(cors());


app.use('/user', userRouting);
app.use('/project', projectRouting);
app.use('/org', orgRouting);
app.use('/email', emailRouting);
app.use('/task', taskRouting);
app.use('/comment', commentRouting);
app.use('/leave', leaveRouting);
app.use('/attendance', attendanceRouting);





app.listen(1731, ()=>{
    console.log('Server Connected');
});
