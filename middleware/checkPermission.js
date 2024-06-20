const { MongoClient } = require('mongodb');

async function checkPermission(req, res, requiredPermission) {
    const email = req.user.email;
    try {
        const allowedPermissionPipeline = [
            {
              '$lookup': {
                'from': 'permissions', 
                'localField': 'role', 
                'foreignField': 'role', 
                'as': 'result'
              }
            }, {
              '$unwind': {
                'path': '$result'
              }
            }, {
              '$match': {
                'email': email
              }
            }, {
              '$project': {
                '_id': 0, 
                'permission': '$result.permission'
              }
            }
        ];

        const client = await MongoClient.connect('mongodb+srv://RS-Tech:Insideout%4018!!@cluster0.4u4yuef.mongodb.net/');
        const userCollection = client.db('CRM').collection('users');

        const permissionCursor = userCollection.aggregate(allowedPermissionPipeline);
        const result = await permissionCursor.toArray();

        await client.close();

        const hasPermission = result[0].permission[requiredPermission];
        if (hasPermission) {
            return true;
        } else {
            return res.status(403).json({ error: 'Unauthorized'});
        }
    } catch (error) {
        console.error('Error checking permissions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = checkPermission;
