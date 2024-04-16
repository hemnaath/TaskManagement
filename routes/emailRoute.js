const express = require('express');
const emailController = require('../controller/emailController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/send', authenticateUser, emailController.mailer);

module.exports=router;