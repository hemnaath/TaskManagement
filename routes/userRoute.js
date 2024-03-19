const express = require('express');
const userController = require('../controller/userController');
const authenticateUser = require('../middleware/auth');
const {upload} = require('../helper/fileHelper');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/dpUpload/:id', upload.single('File'), userController.uploadDp);
router.get('/getDp/:id', userController.getDp);
router.post('/logout', authenticateUser, userController.logout);


module.exports = router;