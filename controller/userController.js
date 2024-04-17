const {passcrypt, compass} = require('../helper/passwordHelper');
const {generateToken} = require('../helper/tokenHelper');
const emailHelper = require('../helper/emailHelper');
const os = require('os');
const db = require('../config/sqlConnector');


const register = async (req, res) =>{
    const {name, username, password, email} = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json('Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.');
    }
    const finder = `SELECT id FROM user WHERE email = ?`;
    db.query(finder, [email], async(err, exists)=>{
        if (exists.length>0){
            return res.status(409).json('User Exists');
        }else {
            const encryptedPassword = await passcrypt(password, 10);
            const creatorSql = `INSERT INTO user (name, username, password, email, role) VALUES (?,?,?,?,'admin')`;
            db.query(creatorSql, [name, username, encryptedPassword, email]);
            return res.status(201).json({message:'User Created'});
        }
    });
}

const inviteUser = async(req, res)=>{
    const {name, username, password, email} = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json('Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.');
    }
    const finder = `SELECT id FROM user WHERE email = ?`;
    db.query(finder, [email], async(err, exists)=>{
        if (exists.length > 0){
            return res.status(409).json('User Exists');
        }else {
            const encryptedPassword = await passcrypt(password, 10);
            const userId = res.locals.id;
            const findOrgSql = `SELECT orgId FROM user WHERE id = ?`;
            const finder = db.query(findOrgSql, [userId]);
            const creatorSql = `INSERT INTO user (name, username, password, email, orgId, role) VALUES (?,?,?,?,?,'editor')`;
            db.query(creatorSql, [name, username, encryptedPassword, email, finder]);
            return res.status(201).json({message:'User Created', creator});
        }
    });
}

const getDp = async(req, res)=>{
    const userId = req.params.id;
    const finderSql = `SELECT id FROM user WHERE id = ?`;
    db.query(finderSql, [userId], (err, exists)=>{
        if(exists){
            const imgLink = 'https://localhost:1731/' + exists.filepath;
            return res.status(200).json({message:imgLink}); 
        }
        return res.status(404).json('User not Found');
    });
}

const login = async (req, res) =>{  
    const {identifier, password} = req.body;
    let token=null; let ipAddr =null;
    let orgFlag = false; 
    let verifyFlag = false;
    const finderSql = `SELECT * FROM user WHERE email = ? OR username = ?`;
    db.query(finderSql, [identifier, identifier], async (err, values)=>{
        if(values.length > 0){
            const comparePassword = await compass(password, values[0].password);
            if(comparePassword){
                token = generateToken({email:values[0].email, id:values[0].id, orgId:values[0].orgId});
                if(values[0].orgId != null){
                    orgFlag = true;
                }
                if(os.type() == 'Darwin'){
                    ipAddr = os.networkInterfaces().en0.filter((e) => e.family === 'IPv4')[0].address;
                    const ipFinderSql = `SELECT * FROM ip WHERE ipAddress = ? AND userId = ?`;
                    db.query(ipFinderSql, [ipAddr, values[0].id], (err, ipExists)=>{
                        if(ipExists.length > 0){
                            return res.status(200).json({token, username:values[0].username, isOrgId:orgFlag, isVerificationRequired:verifyFlag});
                        }else{
                            const otpGenerator = (Math.floor(100000 + Math.random() * 900000)).toString();
                            emailHelper.otpMail(values[0].email, otpGenerator);
                            const otpCreateSql = `INSERT INTO otp (otp) VALUES (?)`;
                            db.query(otpCreateSql, [otpGenerator]);
                            verifyFlag = true;
                            return res.status(200).json({token, username:values[0].username, isOrgId:orgFlag, isVerificationRequired:verifyFlag});
                        }
                    });
                }if(os.type() == 'Windows_NT'){
                    if(os.networkInterfaces().Ethernet != null){
                        ipAddr = os.networkInterfaces().Ethernet.filter((e) => e.family === 'IPv4')[0].address;
                        const ipFinderSql = `SELECT * FROM ip WHERE ipAddress = ? AND userId = ?`;
                        db.query(ipFinderSql, [ipAddr, values[0].id], (err, ipExists)=>{
                            if(ipExists.length > 0){
                                return res.status(200).json({token, username:values[0].username, isOrgId:orgFlag, isVerificationRequired:verifyFlag});
                            }else{
                                const otpGenerator = (Math.floor(100000 + Math.random() * 900000)).toString();
                                emailHelper.otpMail(values[0].email, otpGenerator);
                                const otpCreateSql = `INSERT INTO otp (otp) VALUES (?)`;
                                db.query(otpCreateSql, [otpGenerator]);
                                verifyFlag = true;
                                return res.status(200).json({token, username:values[0].username, isOrgId:orgFlag, isVerificationRequired:verifyFlag});
                            }
                        });
                    }else{
                        ipAddr = os.networkInterfaces()['Wi-Fi'].filter((e) => e.family === 'IPv4')[0].address;
                        const ipFinderSql = `SELECT * FROM ip WHERE ipAddress = ? AND userId = ?`;
                        db.query(ipFinderSql, [ipAddr, values[0].id], (err, ipExists)=>{
                            if(ipExists.length > 0){
                                return res.status(200).json({token, username:values[0].username, isOrgId:orgFlag, isVerificationRequired:verifyFlag});
                            }else{
                                const otpGenerator = (Math.floor(100000 + Math.random() * 900000)).toString();
                                emailHelper.otpMail(values[0].email, otpGenerator);
                                const otpCreateSql = `INSERT INTO otp (otp) VALUES (?)`;
                                db.query(otpCreateSql, [otpGenerator]);
                                verifyFlag = true;
                                return res.status(200).json({token, username:values[0].username, isOrgId:orgFlag, isVerificationRequired:verifyFlag});
                            }
                        });
                    }
                }
            }
        }else{
            return res.status(404).json('User Not Found');  
        } 
    });
}

const verifyOtp = async (req, res) =>{
    let ipAddr, ipExists = null;
    const {otp} = req.body;
    const finderSql = `SELECT otp FROM otp WHERE otp = ?`;
    db.query(finderSql, [otp], (err, values)=>{
        if(values.length > 0){
            if(os.type() == 'Darwin'){
                ipAddr = os.networkInterfaces().en0.filter((e) => e.family === 'IPv4')[0].address;
            }if(os.type() == 'Windows_NT'){
                if(os.networkInterfaces().Ethernet != null){
                    ipAddr = os.networkInterfaces().Ethernet.filter((e) => e.family === 'IPv4')[0].address;
                }else{
                    ipAddr = os.networkInterfaces()['Wi-Fi'].filter((e) => e.family === 'IPv4')[0].address;
                }
            }
            const ipCreatorSql = `INSERT INTO ip (ipAddress, userId) VALUES (?,?)`;
            db.query(ipCreatorSql, [ipAddr, res.locals.id]);
            const ipDeleteSql = `TRUNCATE TABLE otp`;
            db.query(ipDeleteSql);
            return res.status(200).json('OTP Verified');
        }else{
            return res.status(400).json('Invalid OTP');
        }
    });
    
}

const logout = async(req,res)=>{
    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1];
    if(authHeader){
        delete(token);
        res.status(200).json('User LoggedOut');
    }
}

const uploadDp = async(req, res)=>{
    const userId = res.locals.id;
    const finderSql = `SELECT id FROM user WHERE id = ?`;
    db.query(finderSql, [userId], (err, exists)=>{
        if(exists.length > 0){
            if(req.file.size <= 1024 * 1024){
                const updaterSql = `UPDATE user SET filename = ?, filepath = ?, filetype = ?, filesize = ? WHERE id = ?`;
                db.query(updaterSql, [req.file.originalname, req.file.path, req.file.mimetype, req.file.size]);
                return res.status(200).json('Image Uploaded');
            }else{
                return res.status(400).json('Image Size too Large');
            }
        }
        return res.status(404).json('User not Found');
    });
}


module.exports={
    register,login,logout,
    uploadDp,
    getDp,
    inviteUser,verifyOtp,
}