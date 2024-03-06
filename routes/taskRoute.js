const express = require('express');
const taskController = require('../controller/taskController');

const router = express.Router();

router.post('/createTask', taskController.createTask);
router.get('/getAlltask', taskController.getAlltask);
router.get('/getTask/:id', taskController.getTask);
router.put('/updateTask/:id', taskController.updateTask);
router.delete('/deleteTask/:id', taskController.deleteTask);


module.exports = router;