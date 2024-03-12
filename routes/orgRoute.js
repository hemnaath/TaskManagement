const express = require('express');
const orgController = require('../controller/orgController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/createOrg', authenticateUser, orgController.createOrg);

module.exports = router;