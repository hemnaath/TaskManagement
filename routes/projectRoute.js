const express = require('express');
const projectController = require('../controller/projectController');
const authenticateUser = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();

router.post('/create', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.createProject);
router.get('/get-all', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.getAllProjects);
router.put('/update/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.updateProject);
router.delete('/delete/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.deleteProject);
router.get('/get-project/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.getProjectById);

module.exports = router;