const Org = require('../model/orgModel');

const createOrg = async(req, res)=>{
    const {orgName, orgType} = req.body;
    const creator = Org.create({orgName, orgType});
    return res.status(201).json({message:'Created', creator});
}


module.exports = {
    createOrg
}