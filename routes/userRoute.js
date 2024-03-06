const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/createUser', userController.createUser);
router.post('/signUp', userController.signUp);
router.get('/signIn', userController.signIn);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.get('/getAllUser', userController.getAllUser);
router.get('/getUserById/:id', userController.getUserById);


module.exports = router;