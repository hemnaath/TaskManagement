const express = require('express');
const userController = require('../controller/userController');
const authenticateUser = require('../middleware/auth');
const {upload} = require('../helper/fileHelper');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/dp-upload', upload.single('File'), userController.uploadDp);
router.get('/get-dp/:id', userController.getDp);
router.post('/logout', authenticateUser, userController.logout);
router.post('/invite', authenticateUser, userController.inviteUser);
router.post('/verify-otp', authenticateUser, userController.verifyOtp);


module.exports = router;