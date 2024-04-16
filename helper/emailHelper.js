const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'hemnaathrsurya@gmail.com',
        pass:'phso xira lqjw ycrx',
    }
})

const inviteMail = async(to)=>{
    await transport.sendMail({
        from:'hemnaathrsurya@gmail.com',
        to,
        subject:'Register Invitation',
        text:'You have been invited to register with the portal with the link attached below'
    })
}

const otpMail = async(to, text)=>{
    await transport.sendMail({
        from:'hemnaathrsurya@gmail.com',
        to,
        subject:'OTP verification',
        text,
    })
}

module.exports = {inviteMail, otpMail};