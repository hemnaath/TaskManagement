const express = require('express');
const leaveController = require('../controller/leaveController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const checkPermission = require('../middleware/checkPermission');



const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

const checkPermissionsMiddleware = (requiredPermission) => async (req, res, next) => {
    try {
        const permissionGranted = await checkPermission(req, res, requiredPermission);
        if (permissionGranted) {
            next();
        }
    } catch (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

router.post('/reset-leave', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('reset_leave'), leaveController.resetLeave);
router.post('/apply-leave', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('apply_leave'), leaveController.applyLeave);
router.get('/leave-request', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('leave_request'), leaveController.leaveRequest);
router.patch('/approve-leave/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('approve_leave'), leaveController.approveLeave);

module.exports = router;