const express = require('express');
const logController = require('../controller/logController');

const router = express.Router();

router.post('/createLog', logController.createLog);
router.put('/updateLog/:id', logController.updateLog);
router.get('/getAllLog', logController.getAllLog);
router.get('/getLog/:id', logController.getLog);
router.delete('/deleteLog/:id', logController.deleteLog);


module.exports = router;