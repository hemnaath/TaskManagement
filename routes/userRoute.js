const express = require('express');
const userController = require('../controller/userController');
const passport = require('../middleware/auth');
const { upload } = require('../helper/fileHelper');
const createRateLimiter = require('../middleware/rateLimiter');
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

const checkPermissionsMiddleware = (requiredPermission) => async (req, res, next) => {
    try {
        const permissionGranted = await checkPermission(req, res, requiredPermission);
        if (permissionGranted) {
            next();
        }
    } catch (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

router.post('/register', createRateLimiter(10 * 60 * 1000, 50), userController.register);
router.post('/login', createRateLimiter(10 * 60 * 1000, 100), userController.login);
router.patch('/dp-upload', authenticateUser, upload.single('File'), createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('upload_dp'), userController.uploadDp);
router.patch('/reset-password', createRateLimiter(10 * 60 * 1000, 50), userController.resetPassword);
router.post('/forget-password', createRateLimiter(10 * 60 * 1000, 50), userController.forgetPassword);
router.get('/get-dp', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('get_dp'), userController.getDp);
router.post('/logout', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), checkPermissionsMiddleware('logout'), userController.logout);
router.post('/invite-user', userController.inviteUser);
router.post('/send-invite', authenticateUser, createRateLimiter(10 * 60 * 1000, 100), checkPermissionsMiddleware('send_invite'), userController.sendInvite);
router.patch('/assign-reporting-person', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('assign_reporting_person'), userController.assignReportingPerson);

module.exports = router;
