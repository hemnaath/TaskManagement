const express = require('express');
const orgController = require('../controller/orgController');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

router.post('/create-org', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), orgController.createOrg);
router.get('/get-org', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), orgController.getOrg);
router.put('/update-org/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), orgController.updateOrg);
router.delete('/delete-org/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), orgController.deleteOrg);

module.exports = router;