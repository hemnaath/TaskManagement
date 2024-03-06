const jwt = require('jsonwebtoken');
require ('dotenv').config();

const auth = async(req, res)=>{
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.email = payload?.email;
    } catch (error) {

    }
}