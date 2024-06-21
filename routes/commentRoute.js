const commentController = require('../controller/commentController');
const express = require('express');
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

router.post('/create-comment/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('create_comment'), commentController.createComment);
router.patch('/update-comment/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('update_comment'), commentController.updateComment);
router.delete('/delete-comment/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('delete_comment'), commentController.deleteComment);
router.get('/get-comment/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('get_comment'), commentController.getComment);

module.exports = router;