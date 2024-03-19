const User = require('../model/userModel');
const {passcrypt, compass} = require('../helper/passwordHelper');
const {generateToken, refreshGenerateToken} = require('../helper/tokenHelper');

const register = async (req, res) =>{
    const {name, username, password, email} = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json('Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.');
    }
    const exists = await User.findOne({email});
    if (exists){
        return res.status(409).json('User Exists');
    }else if(!exists){
        const encryptedPassword = await passcrypt(password, 10);
        const creator = await User.create({name, username, password:encryptedPassword, email});
        return res.status(201).json({message:'User Created', creator});
    }
}

const getDp = async(req, res)=>{
    const userId = req.params.id;
    const exists = await User.findOne({_id:userId});
    if(exists){
        const imgLink = 'https://localhost:1731/' + exists.filepath;
        return res.status(200).json({message:imgLink}); 
    }
    return res.status(404).json('User not Found');
}

const signIn = async (req, res) =>{
    const {identifier, password} = req.body;
    const exists = await User.findOne({$or:[{email:identifier}, {username:identifier}]});
    if (exists){
        const comparePassword = await compass(password, exists.password);
        if(comparePassword){
            const token = generateToken({email:exists.email});
            return res.status(200).json({token, username:exists.username});
        }
    }
    return res.status(404).json('User Not Found');
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
    const userId = req.params.id;
    const exists = User.findOne({_id:userId});
    if(exists){
        const updater = await exists.updateOne({$set:{
            filename: req.file.originalname,
            filepath: req.file.path,
            filetype: req.file.mimetype,
            filesize: req.file.size
        }});
        if(req.file.size <= 1024 * 1024){
            return res.status(200).json('Image Uploaded');
        }else{
            return res.status(400).json('Image Size too Large');
        }
    }
    return res.status(404).json('User not Found');
}


module.exports={
    register,signIn,logout,
    uploadDp,
    getDp,
}