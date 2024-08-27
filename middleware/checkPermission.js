const Permission = require('../model/permissionModel');

const Module = require('../model/moduleModel');

const checkPermission = (requiredModule, requiredFunctionality) => {
    return async (req, res, next) => {
        try {
            const roleId = req.user.role;
            console.log(`Checking permissions for role ID: ${roleId}`);

            const module = await Module.findOne({ module_name: requiredModule });
            if (!module) {
                console.log(`Module ${requiredModule} not found in the database.`);
                return res.status(403).json({ error: `Forbidden: No module named ${requiredModule}` });
            }

            const roleWithPermissions = await Permission.findOne({ role: roleId });
            if (!roleWithPermissions) {
                console.log('No permissions found for this role.');
                return res.status(403).json({ error: 'Forbidden: No permissions found for this role' });
            }
            console.log('Permissions found:', roleWithPermissions.permissions);

            const modulePermission = roleWithPermissions.permissions.find(permission => permission.module_id.equals(module._id));
            if (!modulePermission || !modulePermission.allowed) {
                console.log(`Module ${requiredModule} is not allowed.`);
                return res.status(403).json({ error: `Forbidden: No access to the module ${requiredModule}` });
            }

            const functionalityPermission = modulePermission.functionalities.find(func => func.functionality_name === requiredFunctionality);
            if (!functionalityPermission || !functionalityPermission.allowed) {
                console.log(`Functionality ${requiredFunctionality} is not allowed.`);
                return res.status(403).json({ error: `Forbidden: No access to the functionality ${requiredFunctionality}` });
            }

            next(); 
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};
module.exports = checkPermission;
