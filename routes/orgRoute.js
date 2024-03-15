const express = require('express');
const orgController = require('../controller/orgController');

const router = express.Router();

router.post('/createOrg', orgController.createOrg);

module.exports = router;