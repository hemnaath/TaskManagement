const express = require('express');
const roleController = require('../controller/roleController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

router.post('/add-role', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), roleController.addRole);
router.post('/delete-role', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), roleController.deleteRole);

module.exports = router;