const express = require('express');
const attendanceController = require('../controller/attendanceController');
const passport = require('../middleware/auth');

const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

router.post('/check-in', authenticateUser, attendanceController.checkIn);

module.exports = router;