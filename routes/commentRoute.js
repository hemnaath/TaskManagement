const express = require('express');
const commentController = require('../controller/commentController');

const router = express.Router();

router.post('/createComment', commentController.createComment);
router.get('/getAllComment', commentController.getAllComment);
router.get('/getComment/:id', commentController.getComment);
router.put('/updateComment/:id', commentController.updateComment);
router.delete('/deleteComment/:id', commentController.deleteComment);


module.exports = router;