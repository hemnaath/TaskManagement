const express = require('express');
const timesheetController = require('../controller/timesheetController');
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
const authenticateUser = passport.authenticate('jwt', {session:'false'});


router.get('/my-timesheet-data', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), timesheetController.myTimesheetData);
router.get('/team-timesheet-data', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), timesheetController.teamTimesheetData);
router.get('/get-team-members', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), timesheetController.getTeamMembers);
router.get('/get-weekly-report/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), timesheetController.getWeeklyReport);

module.exports = router;