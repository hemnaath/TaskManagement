const express = require('express');
const router = express.Router();
const permissionController = require('../controller/permissionController');

router.post('/add-permissions', permissionController.addPermission);
router.post('/update-permissions',permissionController.updatePermission)
router.delete('/delete-permissions',permissionController.deletePermission)
router.put('/permissions/all/:roleId', permissionController.updateAllPermissions);
router.delete('/permissions/all/:permissionId', permissionController.deleteAllPermissions);
router.get('/functionalities/module/:moduleId', permissionController.getModuleIdWithFunctionalities);
router.get('/permissions/role/:roleId/modules-functionalities',permissionController.getRoleIdWithModulesAndFunctionalities);
module.exports = router;