const express = require('express');
const timesheetController = require('../controller/timesheetController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();
const authenticateUser = passport.authenticate('jwt', {session:'false'});

router.get('/my-timesheet-data', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), timesheetController.myTimesheetData);
router.get('/team-timesheet-data', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), timesheetController.teamTimesheetData);

module.exports = router;