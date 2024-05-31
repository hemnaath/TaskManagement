const express = require('express');
const taskController = require('../controller/taskController');
const passport = require('../middleware/auth');
const fileHelper = require('../helper/fileHelper');
const multer = require('multer');
const createRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();
const upload = multer();
const authenticateUser = passport.authenticate('jwt', { session: false })

router.post('/create/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), fileHelper.upload.single('File'), taskController.createTask);
router.put('/update/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), fileHelper.upload.single('File'), taskController.updateTask);
router.delete('/delete/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), taskController.deleteTask);
router.get('/task-pagination/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), taskController.taskPagination);
router.get('/get-task/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), taskController.getTask);

module.exports = router;
