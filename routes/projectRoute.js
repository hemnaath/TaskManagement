const express = require('express');
const projectController = require('../controller/projectController');
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

router.post('/create-project', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('create_project'), projectController.createProject);
router.get('/get-all-project', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('get_all_project'), projectController.getAllProjects);
router.patch('/update-project/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('update_project'), projectController.updateProject);
router.delete('/delete-project/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('delete_project'), projectController.deleteProject);
router.get('/get-project-data/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('get_project'), projectController.getProjectById);

module.exports = router;