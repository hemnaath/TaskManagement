const { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');


const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

async function createDirectory(directoryName) {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/task/${directoryName}/`,
            Body: ''
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
    } catch (err) {
        console.error('Error creating directory:', err);
    }
}

async function deleteDirectory(directoryName) {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: `uploads/task/${directoryName}/`,
        };
        const listedObjects = await s3Client.send(new ListObjectsV2Command(params));
        if (listedObjects.Contents.length === 0) {
            return res.status(400).json({message:'No objects to delete'});
        }
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
            },
        };
        await s3Client.send(new DeleteObjectsCommand(deleteParams));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete the directory');
    }
}

async function uploadFileToS3(buffer, s3Key) {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: buffer,
            ContentType: 'image/jpeg',
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${s3Key}`;
        return s3Url;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
}

async function deleteFileFromS3(s3Key) {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
        };
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
}

async function listFilesInS3(prefix = '') {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: prefix,
        };
        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command);
        return data.Contents.map(item => item.Key);
    } catch (error) {
        console.error('Error listing files in S3:', error);
        throw new Error('Failed to list files in S3');
    }
}

async function downloadImageFromS3(s3Key) {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
        };
        const command = new GetObjectCommand(params);
        const { Body } = await s3Client.send(command);
        const chunks = [];
        for await (const chunk of Body) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    } catch (error) {
        console.error('Error downloading image from S3:', error);
        throw new Error('Failed to download image from S3');
    }
}




module.exports = {
    uploadFileToS3,
    deleteFileFromS3,
    listFilesInS3,
    downloadImageFromS3,
    createDirectory,
    deleteDirectory,
};

