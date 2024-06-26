const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.APP_EMAIL,
        pass:process.env.APP_PASSWORD,
    }
})

const inviteMail = async(to, url)=>{
    await transport.sendMail({
        from:process.env.APP_EMAIL,
        to,
        subject:'Register Invitation',
        text:'You have been invited to register with the portal with the link attached below'+' '+ `${url}`
    })
}

const verificationEmail = async(to, url, username)=>{
    await transport.sendMail({
        from:process.env.APP_EMAIL,
        to,
        subject:'E-mail verification',
        html:`<div style="width: 950px; height: 230px; background-color: white; border: 1px solid black; padding: 20px; text-align: left;">
        <h2 style="text-align: center; margin-bottom: 20px;">VERIFY E-MAIL</h2>
        <p style="font-size: 16px; color: #333; text-align: left; margin-bottom: 20px;">Hi ${username},</p>
        <p style="font-size: 16px; color: #333; text-align: left; margin-bottom: 20px;">Here's your email verification link. You can click below to verify your email</p>
        <p style="text-align: left; margin-bottom: 0;"><a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p style="font-size: 16px; color: #333; text-align: left; margin-bottom: 20px;">If not you kindly ingnore this mail</p>

    </div>`
    })
}

const passwordReset = async(to, url, username)=>{
    await transport.sendMail({
        from:process.env.APP_EMAIL,
        to,
        subject:'Password reset',
        html:`<div style="width: 950px; height: 230px; background-color: white; border: 1px solid black; padding: 20px; text-align: left;">
        <h2 style="text-align: center; margin-bottom: 20px; color:red;">PASSWORD RESET</h2>
        <p style="font-size: 16px; color: #333; text-align: left; margin-bottom: 20px;">Hi ${username},</p>
        <p style="font-size: 16px; color: #333; text-align: left; margin-bottom: 20px;">Here's your password reset link. You can click below to reset your password</p>
        <p style="text-align: left; margin-bottom: 0;"><a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p style="font-size: 16px; color: #333; text-align: left; margin-bottom: 20px;">If not you kindly ingnore this mail</p>

    </div>
    
    
      `
    })
}

module.exports = {inviteMail, verificationEmail, passwordReset};