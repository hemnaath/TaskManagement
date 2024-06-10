const express = require('express');
const leaveController = require('../controller/leaveController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

router.post('/reset-leave', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), (req, res, next)=>{
    if(req.user.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, leaveController.resetLeave);
router.post('/apply-leave', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), leaveController.applyLeave);
router.get('/leave-request', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), leaveController.leaveRequest);
router.patch('/approve-leave/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), leaveController.approveLeave);

module.exports = router;