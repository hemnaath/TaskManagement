const express = require('express');
const teamController = require('../controller/teamController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/createTeam', authenticateUser, teamController.createTeam);
router.put('/updateTeam/:id', teamController.updateTeam);
router.delete('/deleteTeam/:id', teamController.deleteTeam);
router.get('/getAllTeam', teamController.getAllTeam);
router.get('/getTeamById/:id', teamController.getTeamById);



module.exports = router;