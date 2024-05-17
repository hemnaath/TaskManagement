const express = require('express');
const userController = require('../controller/userController');
const authenticateUser = require('../middleware/auth');
const {upload} = require('../helper/fileHelper');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();

router.post('/register', createRateLimiter(10 * 60 * 1000, 50), userController.register);
router.post('/login', createRateLimiter(10 * 60 * 1000, 100), userController.login);
router.post('/dp-upload', authenticateUser, upload.single('File'), createRateLimiter(10 * 60 * 1000, 50), userController.uploadDp);
router.put('/reset-password', createRateLimiter(10 * 60 * 1000, 50), userController.changePassword);
router.post('/forget-password', createRateLimiter(10 * 60 * 1000, 50), userController.forgetPassword);
router.get('/get-dp', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), userController.getDp);
router.post('/logout', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), userController.logout);
router.post('/invite', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), (req, res, next)=>{
    if(res.locals.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, userController.inviteUser);
router.post('/verify-otp', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), userController.verifyOtp);
router.get('/assign-reporting-person', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), (req, res, next)=>{
    if(res.locals.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, userController.assignReportingPerson);


module.exports = router;