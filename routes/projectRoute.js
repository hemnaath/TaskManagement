const express = require('express');
const projectController = require('../controller/projectController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const sessionStatus = require('../middleware/session');


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


router.post('/create-project', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), projectController.createProject);
router.get('/get-all-project', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), projectController.getAllProjects);
router.patch('/update-project/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), projectController.updateProject);
router.delete('/delete-project/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), projectController.deleteProject);
router.get('/get-project-data/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), projectController.getProjectDataById);

module.exports = router;