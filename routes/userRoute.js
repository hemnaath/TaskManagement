const express = require('express');
const userController = require('../controller/userController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const {sessionStatus} = require('../middleware/session');
const multer = require('multer');



const authenticateUser = passport.authenticate('jwt', { session: false });
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage:storage});


router.post('/register', createRateLimiter(10 * 60 * 1000, 50), userController.register);
router.get('/verify-email', createRateLimiter(10 * 60 * 1000, 100),userController.verifyEmail);
router.post('/resend-verification-email', createRateLimiter(10 * 60 * 1000, 100),userController.resendVerificationEmail)
router.post('/login', createRateLimiter(10 * 60 * 1000, 100), userController.login);
router.post('/refreshToken',authenticateUser, createRateLimiter(10 * 60 * 1000, 100), sessionStatus, userController.refreshToken);
router.patch('/reset-password', createRateLimiter(10 * 60 * 1000, 50), userController.resetPassword);
router.post('/forget-password', createRateLimiter(10 * 60 * 1000, 50), userController.forgetPassword);
router.get('/get-dp', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), sessionStatus, userController.getDp);
router.post('/logout', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), sessionStatus, userController.logout);
router.post('/invite-user', userController.inviteUser);
router.post('/send-invite', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), sessionStatus, userController.sendInvite);
router.patch('/assign-reporting-person', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), sessionStatus, userController.assignReportingPerson);
router.patch('/dp-upload', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), upload.single('File'), sessionStatus, userController.uploadDp);


module.exports = router;
