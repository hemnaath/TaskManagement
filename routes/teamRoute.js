const express = require('express');
const teamController = require('../controller/teamController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/createTeam', authenticateUser, teamController.createTeam);


module.exports = router;