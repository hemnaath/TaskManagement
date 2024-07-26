const express = require('express');
const taskController = require('../controller/taskController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');
const {sessionStatus} = require('../middleware/session');
const multer = require('multer');



const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });
const storage = multer.memoryStorage();
const upload = multer({storage:storage});


router.post('/create-task/:id', authenticateUser, sessionStatus, createRateLimiter(10 * 60 * 1000, 50), taskController.createTask);
router.delete('/delete-task/:id', authenticateUser, sessionStatus, createRateLimiter(10 * 60 * 1000, 50), taskController.deleteTask);
router.get('/get-task/:id', authenticateUser, sessionStatus, createRateLimiter(10 * 60 * 1000, 50), taskController.getTask);
router.patch('/update-task/:id', authenticateUser, sessionStatus, createRateLimiter(10 * 60 * 1000, 50), upload.single('File'), taskController.updateTask);

module.exports = router;
