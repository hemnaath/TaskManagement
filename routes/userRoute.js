const express = require('express');
const userController = require('../controller/userController');
const passport = require('../middleware/auth');
const {upload} = require('../helper/fileHelper');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

router.post('/register', createRateLimiter(10 * 60 * 1000, 50), userController.register);
router.post('/login', createRateLimiter(10 * 60 * 1000, 100), userController.login);
router.patch('/dp-upload', authenticate, upload.single('File'), createRateLimiter(10 * 60 * 1000, 50), userController.uploadDp);
router.patch('/reset-password', createRateLimiter(10 * 60 * 1000, 50), userController.resetPassword);
router.post('/forget-password', createRateLimiter(10 * 60 * 1000, 50), userController.forgetPassword);
router.get('/get-dp', authenticate, createRateLimiter(10 * 60 * 1000, 50), userController.getDp);
router.post('/logout', authenticate, createRateLimiter(10 * 60 * 1000, 100), userController.logout);
router.post('/invite-user', userController.inviteUser);
router.post('/send-invite', authenticate, createRateLimiter(10 * 60 * 1000, 100), userController.sendInvite);
router.post('/verify-otp', authenticate, createRateLimiter(10 * 60 * 1000, 50), userController.verifyOtp);
router.patch('/assign-reporting-person', authenticate, createRateLimiter(10 * 60 * 1000, 50), (req, res, next)=>{
    if(req.user.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, userController.assignReportingPerson);


module.exports = router;