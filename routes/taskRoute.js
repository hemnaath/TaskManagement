const express = require('express');
const taskController = require('../controller/taskController');
const authenticateUser = require('../middleware/auth');
const fileHelper = require('../helper/fileHelper');
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.post('/create/:id', authenticateUser, fileHelper.upload.single('File'), taskController.createTask);
router.put('/update/:id', authenticateUser, fileHelper.upload.single('File'), taskController.updateTask);
router.delete('/delete/:id', authenticateUser, taskController.deleteTask);
router.get('/task-pagination', authenticateUser, taskController.taskPagination);

module.exports = router;