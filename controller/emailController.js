const emailHelper = require('../helper/emailHelper');

const mailer = async(req, res)=>{
    const{email} = req.body;
    try{
        emailHelper.inviteMail(email);
        return res.status(200).json({message:'Invite sent'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Error sending email'});
    }

}

module.exports = {mailer}