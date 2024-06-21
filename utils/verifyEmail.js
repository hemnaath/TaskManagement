const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config();


const verifyEmail = async (req, res) => {
    const { token } = req.query;
    console.log(`Received token: ${token}`);
    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;

        console.log(`Decoded payload: ${JSON.stringify(decoded)}`);
        const user = await User.findOne(email);
        console.log(user)
        if (!user) {
            return res.status(400).json({ error: 'Invalid token or user not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'Email successfully verified' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { verifyEmail };
