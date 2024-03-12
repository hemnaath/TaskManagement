const User = require('../model/userModel');
const {passcrypt, compass} = require('../helper/passwordHelper');
const {generateToken, refreshGenerateToken} = require('../helper/tokenHelper');


const createUser = async(req, res)=>{
    const {username, password, email, role} = req.body;
    const exists = await User.findOne({where:{username}});
    if(exists){
        res.status(409).json({message:'Record exists'});
    }else{
        const creator = await User.create({username, password, email, role});
        res.status(200).json({message:'User Created', creator});
    }
}

const register = async (req, res) =>{
    const {username, password, email, role} = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json('Invalid Password. It must have at least 8 characters, 1 uppercase letter, 1 special character, and 1 number.');
    }
    const exists = await User.findOne({email});
    if (exists){
        return res.status(409).json('User Exists');
    }else if(!exists){
        const encryptedPassword = await passcrypt(password, 10);
        const creator = await User.create({username, password:encryptedPassword, email, role});
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
            return res.status(200).json({message:'User LoggedIn', token});
        }
    }
    return res.status(404).json('User Not Found');
}

const updateUser = async (req, res)=>{
    const userId = req.params.id;
    const {username, password, email, role} = req.body;
    const exists = await User.findOne({_id:userId});
    if(exists){
        const passwordhash = await passcrypt(password);
        const updater = await exists.updateOne({$set:{username, password:passwordhash, email, role}});
        return res.status(202).json({message:'User Updated', updater});
    }else{
        return res.json(403).json('ERR Updating User');
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

const deleteUser = async(req, res)=>{
    try{
        const userId = req.params.id;
        const exists = await User.findByIdAndDelete({_id: userId});
        if(exists){
            return res.status(200).json('User Deleted');
        }
        return res.status(404).json('User not Found');
    }catch(error){
        return res.status(500).json('Internal server Error', error);
    }
}

const getAllUser = async(req, res)=>{
    const getAll = await User.find();
    if(getAll){
        return res.status(200).json({getAll});
    }
    return res.status(404).json('No users Found');
}

const getUserById = async(req, res)=>{
    const userId = req.params.id;
    const getUser = await User.findOne({_id: userId});
    if(getUser){
        return res.status(200).json({getUser});
    }
    return res.status(404).json('No users Found');
}


module.exports={
    createUser,
    register,signIn,
    updateUser,
    deleteUser,
    getAllUser,
    getUserById,
    uploadDp,
    getDp,
}