const express = require('express');
const leaveController = require('../controller/leaveController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/reset', authenticateUser, (req, res, next)=>{
    if(res.locals.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, leaveController.resetLeave);
router.post('/apply-leave', authenticateUser, leaveController.applyLeave);
router.get('/leave-request', authenticateUser, leaveController.leaveRequest);
router.put('/approve-leave/:id', authenticateUser, leaveController.approveLeave);

module.exports = router;