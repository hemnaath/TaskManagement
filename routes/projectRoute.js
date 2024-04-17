const express = require('express');
const projectController = require('../controller/projectController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/create', authenticateUser, projectController.createProject);
router.get('/get-all', authenticateUser, projectController.getAllProjects);
router.put('/update/:id', authenticateUser, projectController.updateProject);
router.delete('/delete/:id', authenticateUser, projectController.deleteProject);
router.get('/get-project/:id', authenticateUser, projectController.getProjectById);

module.exports = router;