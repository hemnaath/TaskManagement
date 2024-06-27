const User = require('../model/userModel');

async function sessionStatus(req, res) {
    const exists = await User.findById(req.user.id);
    if(exists.is_loggedIn)
        return true;
    else
        return false
}

module.exports= sessionStatus
