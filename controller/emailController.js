const emailHelper = require('../helper/emailHelper');

const mailer = async(req, res)=>{
    const{email} = req.body;
    try{
        emailHelper.inviteMail(email);
        return res.status(200).json('Invite sent');
    }catch(error){
        return res.status(400).json('Error sending email');
    }

}

module.exports = {mailer}