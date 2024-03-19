const express = require('express');
const taskController = require('../controller/taskController');
const authenticateUser = require('../middleware/auth');
const fileHelper = require('../helper/fileHelper');

const router = express.Router();

router.post('/createTask', authenticateUser, fileHelper.uploadPDF, taskController.createTask);
router.get('/getTaskByTeam/:id', authenticateUser, taskController.getTaskByTeam);

module.exports = router;