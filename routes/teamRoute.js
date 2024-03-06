const express = require('express');
const teamController = require('../controller/teamController');

const router = express.Router();

router.post('/createTeam', teamController.createTeam);
router.put('/updateTeam/:id', teamController.updateTeam);
router.delete('/deleteTeam/:id', teamController.deleteTeam);
router.get('/getAllTeam', teamController.getAllTeam);
router.get('/getTeamById/:id', teamController.getTeamById);



module.exports = router;