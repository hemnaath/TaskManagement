const express = require('express');
const taskController = require('../controller/taskController');
const passport = require('../middleware/auth');
const fileHelper = require('../helper/fileHelper');
const multer = require('multer');
const createRateLimiter = require('../middleware/rateLimiter');
const checkPermission = require('../middleware/checkPermission');


const router = express.Router();
const upload = multer();
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

router.post('/create-task/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), fileHelper.upload.single('File'), checkPermissionsMiddleware('create_task'), taskController.createTask);
router.patch('/update-task/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), fileHelper.upload.single('File'), checkPermissionsMiddleware('update_task'), taskController.updateTask);
router.delete('/delete-task/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('delete_task'), taskController.deleteTask);
router.get('/task-pagination/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('task_pagination'), taskController.taskPagination);
router.get('/get-task/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), checkPermissionsMiddleware('get_task'), taskController.getTask);

module.exports = router;
