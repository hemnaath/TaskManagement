const jwt = require('jsonwebtoken');
require ('dotenv').config();

const generateToken = (payload) =>{
    const tok = jwt.sign({ payload, expiresIn: '1h' }, process.env.SECRET_KEY);
    return tok;
}


module.exports = {
    generateToken,
};
