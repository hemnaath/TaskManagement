const express = require('express');
const emailController = require('../controller/emailController');
const authenticateUser = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();

router.post('/send', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), emailController.mailer);

module.exports=router;