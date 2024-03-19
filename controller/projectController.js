const Project = require('../model/projectModel');

const createProject = async(req, res)=>{
    const {projectName,   projectMembers, status,  effortEstimation} = req.body;
    const exists = await Project.findOne({where:{projectName}});
    if(exists){
        res.status(409).json({message:'Record exists'});
    }else{
        const creator = await Project.create({projectName,   projectMembers, status,  effortEstimation});
        res.status(200).json({message:'Project Created', creator});
    }
}



module.exports={
    createProject,
}