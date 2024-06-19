const Role = require('../model/roleModel');

const addRole = async(req, res)=>{
    const {name} = req.body
    try{
        const exists = await Role.findOne({name});
        if(exists){
            return res.status(400).json({message:'Role exists'})
        }else{
            await Role.create({name});
            return res.status(201).json({message:'Role created'});
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({error:'Internal server error'});
    }
}

const deleteRole = async(req, res)=>{
    const roleId = req.params.id;
    try{
        const exists = await Role.findById(roleId);
        if(exists){
            await exists.deleteOne();
            return res.status(200).json({message:'Role deleted'});
        }else{
            return res.status(404).json({message:'Role does not exists'});
        }
    }catch(error){
        return res.status(500).json({error:'Internal server error'});
    }
}


module.exports={
    addRole,deleteRole,
}