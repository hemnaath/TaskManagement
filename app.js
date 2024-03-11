const express = require('express');
const path = require('path');
const db = require('./config/mongoConnector');
const session = require('express-session');
const passport = require('./helper/authHelper');
const authRouter = require('./routes/authRoute');
const userRouting = require('./routes/userRoute');
const projectRouting = require('./routes/projectRoute');
const taskRouting = require('./routes/taskRoute');
const teamRouting = require('./routes/teamRoute');
const logRouting = require('./routes/logRoute');
const commentRouting = require('./routes/commentRoute');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRouter);
app.use('/user', userRouting);
app.use('/project', projectRouting);
app.use('/task', taskRouting);
app.use('/team', teamRouting);
app.use('/log', logRouting);
app.use('/comment', commentRouting);





app.listen(1731, ()=>{
    console.log('Server Connected');
});
