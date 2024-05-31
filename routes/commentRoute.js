const commentController = require('../controller/commentController');
const express = require('express');
const passport = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');


const router = express.Router();
const authenticateUser = passport.authenticate('jwt', { session: false });

router.post('/create/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), commentController.createComment);
router.put('/update/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), commentController.updateComment);
router.delete('/delete/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), commentController.deleteComment);
router.get('/get/:id', authenticateUser, createRateLimiter(10 * 60 * 1000, 50), commentController.getComment);

module.exports = router;