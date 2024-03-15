const Org = require('../model/orgModel');

const createOrg = async(req, res)=>{
    const {orgName, orgType} = req.body;
    const exists = await Org.findOne({orgName});
    if(exists){
        return res.status(400).json(exists);
    }else{
        const creator = Org.create({orgName, orgType});
        res.status(200).json({message:'Org Created', creator});
    }
}


module.exports = {
    createOrg
}