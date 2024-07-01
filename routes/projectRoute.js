const express = require('express');
const projectController = require('../controller/projectController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');



const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });


router.post('/create-project', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.createProject);
router.get('/get-all-project', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.getAllProjects);
router.patch('/update-project/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.updateProject);
router.delete('/delete-project/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.deleteProject);
router.get('/get-project-data/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), projectController.getProjectDataById);

module.exports = router;