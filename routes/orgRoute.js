const express = require('express');
const orgController = require('../controller/orgController');
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

router.post('/create-org', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('create_org'), orgController.createOrg);
router.get('/get-org', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('get_org'), orgController.getOrg);
router.patch('/update-org/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('update_org'), orgController.updateOrg);
router.delete('/delete-org/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('delete_org'), orgController.deleteOrg);

module.exports = router;