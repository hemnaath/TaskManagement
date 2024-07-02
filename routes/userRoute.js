const express = require('express');
const userController = require('../controller/userController');
const passport = require('../middleware/auth');
const { upload } = require('../helper/fileHelper');
const createRateLimiter = require('../middleware/rateLimiter');
const sessionStatus = require('../middleware/session');


const checkSession = async(req, res, next) =>{
    try{
        const sessionFlag = await sessionStatus(req, res);
        if(sessionFlag)
            next();
        else
            return res.status(401).json({error:'Unauthorized'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}

const authenticateUser = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.post('/register', createRateLimiter(10 * 60 * 1000, 50), userController.register);
router.get('/verify-email', createRateLimiter(10 * 60 * 1000, 100),userController.verifyEmail);
router.post('/resend-verification-email', createRateLimiter(10 * 60 * 1000, 100),userController.resendVerificationEmail)
router.post('/login', createRateLimiter(10 * 60 * 1000, 100), userController.login);
router.post('/refreshToken',authenticateUser, createRateLimiter(10 * 60 * 1000, 100), checkSession, userController.refreshToken);
router.patch('/dp-upload', authenticateUser, upload.single('File'), createRateLimiter(10 * 60 * 1000, 50), checkSession, userController.uploadDp);
router.patch('/reset-password', createRateLimiter(10 * 60 * 1000, 50), userController.resetPassword);
router.post('/forget-password', createRateLimiter(10 * 60 * 1000, 50), userController.forgetPassword);
router.get('/get-dp', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkSession, userController.getDp);
router.post('/logout', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), checkSession, userController.logout);
router.post('/invite-user', userController.inviteUser);
router.post('/send-invite', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), checkSession, userController.sendInvite);
router.patch('/assign-reporting-person', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkSession, userController.assignReportingPerson);

module.exports = router;
