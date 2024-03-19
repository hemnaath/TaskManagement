const express = require('express');
const projectController = require('../controller/projectController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/createProject', authenticateUser, projectController.createProject);

module.exports = router;