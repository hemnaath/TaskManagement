const express = require('express');
const timesheetController = require('../controller/timesheetController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const checkPermission = require('../middleware/checkPermission');


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', {session:'false'});

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

router.get('/my-timesheet-data', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('my_timesheet_data'), timesheetController.myTimesheetData);
router.get('/team-timesheet-data', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('team_timesheet_data'), timesheetController.teamTimesheetData);

module.exports = router;