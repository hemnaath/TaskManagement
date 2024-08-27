const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const User = require('../model/userModel');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const getUsersWithinOrg = async (req, res) => {
    try {
        const orgId = req.user.org_id;
        const signedUserData = [];
        const orgUserData = await User.find({ org_id: orgId });
        const client = new S3Client({
            region: process.env.AWS_BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
        for (const user of orgUserData) {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `uploads/profile_picture/${user.filename}`,
            });
            try {
                const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
                const userObj = user.toObject();
                signedUserData.push({
                    username : userObj.username,
                    profilePictureUrl : signedUrl,
                    id : userObj._id,
                });
            } catch (urlError) {
                console.error(`Failed to generate signed URL for user ${user._id}:`, urlError);
                user.profilePictureUrl = null;
            }
        }
        return res.status(200).json(signedUserData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUsersWithinOrg,
};
