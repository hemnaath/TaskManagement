const express = require('express');
const db = require('./config/mongoConnector');
const userRouting = require('./routes/userRoute');
const projectRouting = require('./routes/projectRoute');
const taskRouting = require('./routes/taskRoute');
const teamRouting = require('./routes/teamRoute');
const logRouting = require('./routes/logRoute');
const commentRouting = require('./routes/commentRoute');

const app = express();

app.use(express.json());
app.use('/user', userRouting);
app.use('/project', projectRouting);
app.use('/task', taskRouting);
app.use('/team', teamRouting);
app.use('/log', logRouting);
app.use('/comment', commentRouting);


app.listen(1111, ()=>{
    console.log('Server Connected');
});