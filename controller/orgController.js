const Org = require('../model/orgModel');
const User = require('../model/userModel');

const createOrg = async(req, res)=>{
    const {orgName, orgType} = req.body;
    try{
        const exists = await Org.findOne({org_name:orgName});
        if(exists){
            return res.status(400).json({message:'Org Exists'});
        }else{
            const creator = await Org.create({org_name:orgName, org_type:orgType});
            const updateExists = await User.findOne({_id:res.locals.id});
            if(updateExists){
                await updateExists.updateOne({$set:{org_id: creator._id}});
            }
            res.status(200).json({message:'Org Created', creator});
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

const getOrg = async (req, res)=>{
    try{
        const userExists = await User.findOne({_id:res.locals.id});
        const orgExists = await Org.findOne({_id:userExists.org_id});
        if(orgExists){
            return res.status(200).json(orgExists);
        }else{
            return res.status(400).json('Org not Found');
        }
    }catch(error){
        return res.status(500).json('Internal Server Error');
    }
}

module.exports = {
    createOrg,
    getOrg,
}
