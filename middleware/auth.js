const jwt = require('jsonwebtoken');;
require('dotenv').config();
const User = require('../model/userModel');

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);        
        res.locals.id = decoded.payload.id;
        res.locals.role = decoded.payload.role;
        res.locals.email = decoded.payload.email;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = authenticateUser;