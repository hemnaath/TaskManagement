const chatController = require('../controller/chatController');
const express = require('express');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const {sessionStatus} = require('../middleware/session');


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });


router.get('/get-user-data', authenticateUser, sessionStatus, createRateLimiter(10 * 60 * 1000, 50), chatController.getUsersWithinOrg);


module.exports = router;