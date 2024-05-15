const commentController = require('../controller/commentController');
const express = require('express');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/create/:id', authenticateUser, commentController.createComment);
router.put('/update/:id', authenticateUser, commentController.updateComment);
router.delete('/delete/:id', authenticateUser, commentController.deleteComment);
router.get('/get/:id', authenticateUser, commentController.getComment);

module.exports = router;