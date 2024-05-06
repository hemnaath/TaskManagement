const express = require('express');
const userController = require('../controller/userController');
const authenticateUser = require('../middleware/auth');
const {upload} = require('../helper/fileHelper');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/dp-upload', authenticateUser, upload.single('File'), userController.uploadDp);
router.put('/change-password', userController.changePassword);
router.get('/forget-password', userController.forgetPassword);
router.get('/get-dp', authenticateUser, userController.getDp);
router.post('/logout', authenticateUser, userController.logout);
router.post('/invite', authenticateUser, (req, res, next)=>{
    if(res.locals.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, userController.inviteUser);
router.post('/verify-otp', authenticateUser, userController.verifyOtp);
router.get('/assign-reporting-person', authenticateUser, (req, res, next)=>{
    if(res.locals.role !== 'admin'){
        return res.status(403).json('Unauthorized Access');
    }
    next();
}, userController.assignReportingPerson);


module.exports = router;