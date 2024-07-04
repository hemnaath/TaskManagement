const express = require('express');
const router = express.Router();
const functionalityController = require('../controller/functionalityController');

router.post('/add-functionality', functionalityController.addFunctionality);
router.delete('/delete-functionality/:id',functionalityController.deleteFunctionality);
router.put('/update-functionality/:id', functionalityController.updateFunctionality);
router.get('/get-functionality', functionalityController.getFunctionality);
router.get('/get-functionality/:id', functionalityController.getFunctionalityById);

module.exports = router;
