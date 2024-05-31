const {passcrypt, compass} = require('../helper/passwordHelper');
const {generateToken} = require('../helper/tokenHelper');
const emailHelper = require('../helper/emailHelper');
const Otp = require('../model/otpModel');
const os = require('os');
const Ip = require('../model/ipModel');
const User = require('../model/userModel');
const Timesheet = require('../model/timesheetModel');
const {jwtDecode} = require('jwt-decode');



const register = async (req, res) => {
    const { name, username, password, email } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    try {
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.' });
        }
        const existingUser = await User.findOne({$or:[{ email }, {username}]});
        if (existingUser) {
            return res.status(409).json({ error: 'User Already Exists' });
        }
        const encryptedPassword = await passcrypt(password, process.env.SALT_ROUNDS);
        const newUser = await User.create({ name, username, password: encryptedPassword, email, role: 'admin' });
        const token = generateToken({ name, username, email });
        const verificationUrl = process.env.VERIFICATION + token;
        emailHelper.verificationEmail(email, verificationUrl, username);
        return res.status(201).json({ message: 'User Created', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const forgetPassword = async(req, res)=>{
    const {email} = req.body;
    try{
        const token = generateToken({email:email});
        const exists = await User.findOne({email:email});
        const url = process.env.FORGET_PASSWORD+token;
        await emailHelper.passwordReset(email, url, exists.username);
        return res.status(200).json({message:'Password reset link sent'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const changePassword = async(req, res)=>{
    const {token, password} = req.body;
    try{
        decodedToken = jwtDecode(token);
        if (!decodedToken) {
            return res.status(400).json({message:'Invalid token'});
        }
        const emailId = decodedToken.payload.email;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({message:'Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.'});
        }
        const encryptedPassword = await passcrypt(password, process.env.SALT_ROUNDS);
        await User.updateOne({email:emailId},{$set:{password:encryptedPassword}});
        return res.status(200).json({message:'Password updated'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const inviteUser = async(req, res)=>{
    const {name, username, password, email} = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    try{
        if (!passwordRegex.test(password)) {
            return res.status(400).json({message:'Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.'});
        }
        const exists = await User.findOne({email});
        if (exists){
            return res.status(409).json({message:'User Exists'});
        }else {
            const encryptedPassword = await passcrypt(password, process.env.SALT_ROUNDS);
            const findOrg = await User.findById(req.user.id);
            const creator = await User.create({name, username, password:encryptedPassword, email, org_id:findOrg.org_id, role:'editor'});
            return res.status(201).json({message:'User Created', creator});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const getDp = async(req, res)=>{
    try{
        const userId = req.user.id;
        const exists = await User.findById(userId);
        if(exists){
            const imgLink = 'https://localhost:1731/' + exists.filepath;
            return res.status(200).json({message:imgLink}); 
        }
        return res.status(404).json({message:'User not Found'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const login = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        let token, ipAddr, ipExists, timesheetExists = null;
        let orgFlag = false;
        let verifyFlag = false;
        const exists = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (exists) {
            const comparePassword = await compass(password, exists.password);
            if (comparePassword) {
                token = generateToken({ role: exists.role, id: exists.id, org: exists.org_id });
                if (exists.orgId) {
                    orgFlag = true;
                }
                if (os.type() === 'Darwin') {
                    ipAddr = os.networkInterfaces().en0.find(e => e.family === 'IPv4').address;
                } else if (os.type() === 'Windows_NT') {
                    ipAddr = os.networkInterfaces().Ethernet ? os.networkInterfaces().Ethernet.find(e => e.family === 'IPv4').address :
                    os.networkInterfaces()['Wi-Fi'].find(e => e.family === 'IPv4').address;
                }
                const timezone = { hour12: false, timeZone: 'Asia/Kolkata' };
                const currentDate = new Date().toLocaleDateString();
                const currentTime = new Date().toLocaleTimeString('en-IN', timezone);
                ipExists = await Ip.findOne({ ip_address: ipAddr, user_id: exists.id });
                timesheetExists = await Timesheet.findOne({$and:[{date:currentDate}, {user_id:exists.id}]});
                if(timesheetExists == null || timesheetExists == undefined){
                    if (ipExists) {
                        await Timesheet.create({ date: currentDate, user_id: exists.id, in_time: currentTime, out_time: currentTime, worked_hours: 0 });
                    } else {
                        const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
                        emailHelper.otpMail(exists.email, otp);
                        await Otp.create({ otp });
                        verifyFlag = true;
                        await Timesheet.create({ date: currentDate, user_id: exists.id, in_time: currentTime, out_time: currentTime, worked_hours: 0 });
                    }
                }
                return res.status(200).json({ token, username: exists.username, isOrgId: orgFlag, isVerificationRequired: verifyFlag });
            }
        }

        return res.status(404).json({message:'User Not Found'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const verifyOtp = async (req, res) =>{
    const {otp} = req.body;
    try{
        let ipAddr, ipExists = null;
        const exists = await Otp.findOne({otp:otp});
        if(exists){
            if(os.type() == 'Darwin'){
                ipAddr = os.networkInterfaces().en0.filter((e) => e.family === 'IPv4')[0].address;
                ipExists = await Ip.findOne({$and:[{ip_address:ipAddr}, {user_id:req.user.id}]});
            }if(os.type() == 'Windows_NT'){
                if(os.networkInterfaces().Ethernet != null){
                    ipAddr = os.networkInterfaces().Ethernet.filter((e) => e.family === 'IPv4')[0].address;
                    ipExists = await Ip.findOne({$and:[{ip_address:ipAddr}, {user_id:exists.id}]});
                }else{
                    ipAddr = os.networkInterfaces()['Wi-Fi'].filter((e) => e.family === 'IPv4')[0].address;
                    ipExists = await Ip.findOne({$and:[{ip_address:ipAddr}, {user_id:exists.id}]});
                }
            }
            await Ip.create({ip_address:ipAddr, user_id:req.user.id});
            await Otp.deleteMany();
            return res.status(200).json({message:'OTP Verified'});
        }else{
            return res.status(400).json({message:'Invalid OTP'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
    
}

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const exists = await Timesheet.findOne({ user_id: req.user.id, date: new Date().toLocaleDateString()});
            if (exists) {
                const currentTime = new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' });
                await exists.updateOne({$set:{out_time:currentTime}});
            }
            res.status(200).json({message:'User LoggedOut'});
        }
        await tsWorkedHrs(req.user.id);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

const uploadDp = async(req, res)=>{
    const userId = req.user.id;
    try{
        const exists = User.findById(userId);
        if(exists){
            const updater = await exists.updateOne({$set:{
                filename: req.file.originalname,
                filepath: req.file.path,
                filetype: req.file.mimetype,
                filesize: req.file.size
            }});
            if(req.file.size <= 1024 * 1024){
                return res.status(200).json({message:'Image Uploaded'});
            }else{
                return res.status(400).json({message:'Image Size too Large'});
            }
        }
        return res.status(404).json({message:'User not Found'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}

async function tsWorkedHrs(id) {
    const exists = await Timesheet.findOne({ user_id: id, date: new Date().toLocaleDateString() });
    if (exists) {
        const outTime = exists.out_time.split(':');
        const inTime = exists.in_time.split(':');
        let outTimeHrs = (outTime[0]);
        let outTimeMin = (outTime[1]);
        let inTimeHrs = (inTime[0]);
        let inTimeMin = (inTime[1]);
        let hrs = outTimeHrs - inTimeHrs;
        let min = outTimeMin - inTimeMin;
        if (min < 0) {
            min += 60;
            hrs -= 1;
        }
        let timeDiff = hrs + ':' + min;
        await exists.updateOne({ $set: { worked_hours: timeDiff } });
    }
}

const assignReportingPerson = async(req, res)=>{
    const {username, reportingPerson} = req.body;
    try{
        const findReportingPerson = await User.findOne({username:reportingPerson});
        await User.updateMany({username:username},{reporting_person:findReportingPerson.id});
        return res.status(301).json({message:'Reporting Persons assigned'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error:'Internal Server Error'});
    }
}


module.exports={
    register,login,logout,
    uploadDp,
    getDp,
    inviteUser,verifyOtp,
    assignReportingPerson,
    forgetPassword,changePassword,
}