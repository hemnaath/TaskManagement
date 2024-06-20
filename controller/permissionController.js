const Permission = require('../model/permissionModel');

const setPermission = async(req, res)=>{
    const {role, permissions} = req.body;
    try{
        await Permission.create({role, permission:permissions})
        return res.status(200).json({message:'Permissions set'});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}


module.exports = {
    setPermission,
}