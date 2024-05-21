const express = require('express');
const attendanceController = require('../controller/attendanceController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/check-in', authenticateUser, attendanceController.checkIn);

module.exports = router;