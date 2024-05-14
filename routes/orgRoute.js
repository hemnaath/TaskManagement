const express = require('express');
const orgController = require('../controller/orgController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/create', authenticateUser, orgController.createOrg);
router.get('/get-org', authenticateUser, orgController.getOrg);
router.put('/update/:id', authenticateUser, orgController.updateOrg);
router.delete('/delete/:id', authenticateUser, orgController.deleteOrg);

module.exports = router;