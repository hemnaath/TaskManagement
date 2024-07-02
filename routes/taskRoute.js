const express = require('express');
const taskController = require('../controller/taskController');
const passport = require('../middleware/auth');
const fileHelper = require('../helper/fileHelper');
const createRateLimiter = require('../middleware/rateLimiter');


const checkSession = async(req, res, next) =>{
    try{
        const sessionFlag = await sessionStatus(req, res);
        if(sessionFlag)
            next();
        else
            return res.status(401).json({error:'Unauthorized'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });


router.post('/create-task/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), taskController.createTask);
router.patch('/update-task/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), fileHelper.taskUpload.single('File'), taskController.updateTask);
router.delete('/delete-task/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), taskController.deleteTask);
router.get('/get-task/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), taskController.getTask);

module.exports = router;
