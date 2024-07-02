const express = require('express');
const leaveController = require('../controller/leaveController');
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


router.post('/reset-leave', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), leaveController.resetLeave);
router.post('/apply-leave', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), leaveController.applyLeave);
router.get('/leave-request', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), leaveController.leaveRequest);
router.patch('/approve-leave/:id', authenticateUser, checkSession, createRateLimiter(10 * 60 * 1000, 50), leaveController.approveLeave);

module.exports = router;