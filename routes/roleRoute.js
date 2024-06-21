const express = require('express');
const roleController = require('../controller/roleController');
const passport = require('../middleware/auth');
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

router.post('/add-role', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('add_role'), roleController.addRole);
router.post('/delete-role', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('delete_role'), roleController.deleteRole);

module.exports = router;